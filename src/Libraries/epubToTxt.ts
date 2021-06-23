import JsZip from 'jszip';
import parser from 'fast-xml-parser';

const zip = new JsZip();
const domParser = new DOMParser();

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
    const text = await rootFile.async('text');
    const XMLData = parser.parse(text, {
        ignoreAttributes: false,
        ignoreNameSpace: true,
        attributeNamePrefix: '',
    });

    const epubData = [];

    epubData.push(parseMetadata(XMLData.package.metadata));
    epubData.push(
        parseGuide(XMLData.package.guide, XMLData.package, archive, rootFile)
    );
    epubData.push(parseContent(XMLData.package, archive, rootFile));

    const result = await Promise.all(epubData);

    return result.reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {}
    );
}

//

async function parseMetadata(value: any) {
    const metadata: any = {};
    if (Array.isArray(value.identifier)) {
        for (const item of value.identifier) {
            metadata.id = item['#text'];
            break;
        }
    } else {
        metadata.id = value.identifier['#text'];
    }

    metadata.id = metadata.id.replace('urn:uuid:', '');

    metadata.creator = value.creator;
    metadata.title = value.title;

    return {
        key: 'metadata',
        value: metadata,
    };
}

async function parseContent(
    epubPackage: any,
    archive: JsZip,
    rootFile: JsZip.JSZipObject
) {
    console.log(epubPackage);
    const textFiles: string[] = [];
    if (epubPackage.spine.itemref) {
        for (const { idref } of epubPackage.spine.itemref) {
            const fileInfo = epubPackage.manifest.item.find(
                (item: any) => item.id === idref
            );
            textFiles.push(fileInfo.href);
        }
    }

    if (textFiles.length === 0) {
        return { key: 'items', value: undefined };
    }

    const path = rootFile?.name.split('/');
    path?.pop();

    const items: string[] = [];

    for (const filename of textFiles) {
        const href = path?.concat([filename]).join('/');

        const file = findFile(archive, href!);
        const r = await file?.async('text');
        const text = new DOMParser().parseFromString(
            r!,
            'application/xhtml+xml'
        ).documentElement.textContent;

        if (text) {
            const cleanText = text
                ?.replaceAll('\n', '.')
                ?.replaceAll('?', '?.')
                ?.replaceAll('!', '!.')
                ?.trim();
            if (cleanText !== '') {
                items.push(cleanText);
            }
        }
    }

    return {
        key: 'items',
        value: items,
    };
}

async function parseGuide(
    value: any,
    epubPackage: any,
    archive: JsZip,
    rootFile: JsZip.JSZipObject
) {
    if (!value.reference || value.reference.type !== 'cover') {
        return { key: 'cover', value: undefined };
    }

    const path = rootFile?.name.split('/');
    path?.pop();

    const href = path?.concat([value.reference.href]).join('/');

    if (!href) {
        return { key: 'cover', value: undefined };
    }
    const file = findFile(archive, href);

    if (!file) {
        return { key: 'cover', value: undefined };
    }

    let data = await file.async('blob');
    const foundDescription = epubPackage.manifest.item.find(
        (item: any) => item.href === value.reference.href
    );
    data = data.slice(0, data.size, foundDescription['media-type']);
    // console.log(foundDescription);
    return {
        key: 'cover',
        value: URL.createObjectURL(data),
    };
}

function compileContent(items: string[]) {
    const compiledText = [];

    for (const row of items) {
        const sentences = row
            .split('.')
            .map((item) => item.replaceAll('— ', '—\u00A0').trim())
            .filter((item) => item !== '');
        compiledText.push(...sentences);
    }

    return compiledText.join(' ');
}

async function epubToTxt(blob: Blob) {
    if (blob.type !== 'application/epub+zip') {
        throw new Error('Not an Epub file');
    }

    const archive = await zip.loadAsync(blob);

    if (Object.keys(archive.files).length === 0) {
        throw new Error('No files in archive');
    }

    await validateMimeType(archive);
    const rootFile = await validateRootFile(archive);

    const parsedEpub = await parseRootFile(archive, rootFile);

    const content = compileContent((parsedEpub as any).items);
    delete (parsedEpub as any).items;
    (parsedEpub as any).content = content;

    return parsedEpub;
}

export default epubToTxt;
