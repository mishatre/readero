import JsZip from 'jszip';
import parser from 'fast-xml-parser';
import mime from 'mime-types';

type PickByValue<T, V> = Pick<
    T,
    { [K in keyof T]: T[K] extends V ? K : never }[keyof T]
>;
type Entries<T> = {
    [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]];
}[keyof T][];

type TEpubXMLIdentifier = {
    value: string;
    attr: {
        id: string;
    };
};

interface IEpubXMLMetadata {
    identifier: TEpubXMLIdentifier | TEpubXMLIdentifier[];
    title: string;
    language: string;
    creator?: string;

    description?: string;
    subject?: string;
    publisher?: string;

    date?: string | number;

    meta: Array<{ attr: { name: string; content: string | number } }>;
}

interface IEpubXMLManifest {
    item: Array<{ attr: { href: string; 'media-type': string; id: string } }>;
}

interface IEpubXMLSpineItemRef {
    attr: {
        id?: string;
        idref: string;
        linear?: 'yes' | 'no';
    };
}

interface IEpubXMLSpine {
    attr: {
        id?: string;
        'page-progression-direction'?: 'rtl' | 'ltr';
        toc?: string;
    };
    itemref: IEpubXMLSpineItemRef | IEpubXMLSpineItemRef[];
}

interface IXMLData {
    package: {
        attr: {
            version: number;
            'unique-identifier': string;
        };
        metadata: IEpubXMLMetadata;
        manifest: IEpubXMLManifest;
        spine: IEpubXMLSpine;
        guide?:
            | string
            | {
                  reference: {
                      attr: {
                          href: string;
                          type: string;
                          title: string;
                      };
                  };
              };
    };
}

interface IEpubMetadata {
    identifier: string;
    publisher?: string;
    language?: string;
    title?: string;
    subject?: string;
    description?: string;
    creator?: string;
    date?: string;
}

interface IEpubSpine {
    id?: string;
    direction?: 'rtl' | 'ltr';
    toc?: string;
    items: Array<string>;
}

type TEpubManifest = {
    href: string;
    'media-type': string;
    id: string;
}[];

type TEpubGuide = {
    href: string;
    type: string;
    title: string;
};

function findFile(archive: JsZip, filename: string) {
    if (archive.files[filename]) {
        return archive.files[filename];
    }
    const result = archive.filter(
        (_, file) => file.name.toLowerCase() === filename.toLowerCase()
    );
    if (result.length > 0) {
        return result[0];
    }
    return null;
}

async function validateMimeType(archive: JsZip) {
    const mimeFile = findFile(archive, 'mimetype');
    if (!mimeFile) {
        throw new Error('No mimetype file in archive');
    }

    const epubMimeType = await mimeFile.async('text');

    if (epubMimeType.toLowerCase().trim() !== 'application/epub+zip') {
        throw new Error('Unsupported mime type');
    }
}

async function validateRootFile(archive: JsZip) {
    const containerFile = findFile(archive, 'meta-inf/container.xml');
    if (!containerFile) {
        throw new Error('No container file in archive');
    }

    const xmlData = await containerFile.async('text');
    const parsedXML = parser.parse(xmlData, { ignoreAttributes: false });

    if (
        !parsedXML.container.rootfiles ||
        !parsedXML.container.rootfiles.rootfile
    ) {
        throw new Error('No rootfiles found');
    }

    const rootFileInfo = parsedXML.container.rootfiles.rootfile;
    let filename: string;

    if (rootFileInfo['@_media-type'] !== 'application/oebps-package+xml') {
        throw new Error('Rootfile in unknown format');
    }

    filename = rootFileInfo['@_full-path'];

    if (!filename) {
        throw new Error('Empty rootfile');
    }

    const rootFile = findFile(archive, filename);
    if (!rootFile) {
        throw new Error('Rootfile not found from archive');
    }

    return rootFile;
}

async function parseRootFile(archive: JsZip, rootFile: JsZip.JSZipObject) {
    const rootFileXML = await rootFile.async('text');
    const XMLData = parser.parse(rootFileXML, {
        attributeNamePrefix: '',
        attrNodeName: 'attr',
        textNodeName: 'value',
        ignoreAttributes: false,
        ignoreNameSpace: true,
        parseAttributeValue: true,
    }) as IXMLData;

    const metadata = parseMetadata(XMLData);
    const spine = parseSpine(XMLData);
    const manifest = parseManifest(XMLData);
    const guide = parseGuide(XMLData);

    // console.log(XMLData, spine)

    const processingItems = processItems(manifest, spine);
    const words = await loadItems(archive, rootFile, processingItems);

    const foundCover = findCover(manifest, guide);
    const cover = await loadCover(archive, rootFile, foundCover);

    return {
        cover,
        metadata,
        words,
    };
}

function parseMetadata(XMLData: IXMLData) {
    const metadata: Partial<IEpubMetadata> = {};

    const uidName = XMLData.package.attr['unique-identifier'];
    const entries = Object.entries(
        XMLData.package.metadata
    ) as Entries<IEpubXMLMetadata>;
    for (const entry of entries) {
        if (entry) {
            const [key, value] = entry;

            if (value) {
                let parsedValue = null;
                if (key === 'identifier') {
                    parsedValue = value;
                    if (Array.isArray(value)) {
                        parsedValue = (value as TEpubXMLIdentifier[]).find(
                            (item) => item.attr.id === uidName
                        );
                        if (parsedValue) {
                            parsedValue = parsedValue.value;
                        }
                    } else {
                        parsedValue = (value as TEpubXMLIdentifier).value;
                    }
                    if (parsedValue) {
                        parsedValue = String(parsedValue)
                            .replace('urn:uuid:', '')
                            .toUpperCase()
                            .trim();
                    } else {
                        throw new Error(
                            'Cannot determine book unique identifier'
                        );
                    }
                } else {
                    if (typeof value === 'object') {
                        // TODO: Do better typings
                        parsedValue = (value as any).value;
                    } else {
                        parsedValue = value;
                    }
                }
                metadata[key as keyof IEpubMetadata] = parsedValue;
            }
        }
    }

    return metadata as IEpubMetadata;
}

function parseSpine(XMLData: IXMLData) {
    const spine: Partial<IEpubSpine> = {
        items: [],
    };
    if ('id' in XMLData.package.spine.attr) {
        spine.id = XMLData.package.spine.attr.id;
    }
    if ('page-progression-direction' in XMLData.package.spine.attr) {
        spine.direction =
            XMLData.package.spine.attr['page-progression-direction'];
    }
    if ('toc' in XMLData.package.spine.attr) {
        spine.toc = XMLData.package.spine.attr.toc;
    }

    if (Array.isArray(XMLData.package.spine.itemref)) {
        for (const item of XMLData.package.spine.itemref) {
            spine.items?.push(item.attr.idref);
        }
    } else {
        spine.items?.push(XMLData.package.spine.itemref.attr.idref);
    }

    return spine as IEpubSpine;
}

function parseManifest(XMLData: IXMLData) {
    const manifest: TEpubManifest = [];
    for (const item of XMLData.package.manifest.item) {
        manifest.push(item.attr);
    }
    return manifest;
}

function parseGuide(XMLData: IXMLData) {
    if (!XMLData.package.guide || typeof XMLData.package.guide === 'string') {
        return undefined;
    }
    // There is books where guide is array;
    return XMLData.package.guide.reference.attr;
}

//

function findCover(manifest: TEpubManifest, guide?: TEpubGuide) {
    if (guide && guide.type === 'cover') {
        return guide;
    }
    for (const item of manifest) {
        if (item.id.includes('cover.jpg')) {
            return item;
        }
    }
}
function processItems(manifest: TEpubManifest, spine: IEpubSpine) {
    const items = [];
    for (const id of spine.items) {
        const item = manifest.find((item) => item.id === id);
        if (item && item['media-type'] === 'application/xhtml+xml') {
            items.push(item);
        }
    }
    return items;
}

//

async function loadCover(
    archive: JsZip,
    rootFile: JsZip.JSZipObject,
    cover?: { href: string; 'media-type'?: string }
) {
    if (!cover) {
        return null;
    }

    const [path] = rootFile?.name.split('/');
    const filePath = [path, cover.href].join('/');
    const blob = await archive.files[filePath].async('blob');

    const type = cover['media-type'] || mime.lookup(cover.href);

    if (!type) {
        return blob;
    }

    return blob.slice(0, blob.size, type);
}

async function loadItems(
    archive: JsZip,
    rootFile: JsZip.JSZipObject,
    processingItems: Array<{ href: string }>
) {
    const [path] = rootFile?.name.split('/');

    const loadingItems = [];
    for (const { href } of processingItems) {
        const filePath = [path, href].join('/');
        loadingItems.push(archive.files[filePath].async('text'));
    }
    const domParser = new DOMParser();
    const loadedItems = await Promise.all(loadingItems);

    const chapters = loadedItems.map((item) => {

        const sentences: string[] = [];
        const sentencesNodes = domParser.parseFromString(item, 'application/xhtml+xml').body.querySelectorAll('p');
        sentencesNodes.forEach((value) => {
            sentences.push(value.textContent || '');
        })

        return sentences;

        // return '' + domParser.parseFromString(item, 'application/xhtml+xml').body.textContent
    });

    const words = [];

    for(const chapter of chapters) {
        for(const sentence of chapter) {

            const wordsArray = sentence?.replaceAll('\n', ' ')?.split(' ').filter(v => v !== '').map(v => v.trim());
            if(wordsArray?.length > 0) {
                words.push(...wordsArray);
            }

        }
    }

    return words

}

async function epubToTxt(blob: Blob) {
    if (blob.type !== 'application/epub+zip') {
        throw new Error('Not an Epub file');
    }

    const zip = new JsZip();
    const archive = await zip.loadAsync(blob);

    if (Object.keys(archive.files).length === 0) {
        throw new Error('No files in archive');
    }

    await validateMimeType(archive);
    const rootFile = await validateRootFile(archive);
    const parsedEpub = await parseRootFile(archive, rootFile);

    return parsedEpub;
}

export default epubToTxt;
