import JsZip from 'jszip';
import parser from 'fast-xml-parser';

const zip = new JsZip();

interface IMetadata {
    id?: string;
    publisher?: string;
    language?: string;
    title?: string;
    subject?: string;
    description?: string;
    creator?: string;
    date?: number;
}

class EPub {
    public cover: string | null = null;
    public metadata: IMetadata = {};
    public flow: string[] = [];
    private items: { [key: string]: string }[] = [];
    public compiled: string = '';

    private containerFile: JsZip.JSZipObject | null = null;
    private mimeFile: JsZip.JSZipObject | null = null;
    private rootFile: JsZip.JSZipObject | null = null;

    private file!: JsZip;
    constructor(private data: Blob) {
        if (data.type !== 'application/epub+zip') {
            console.log(new Error('Not an Epub file'));
            return;
        }
    }

    public async parse() {
        return await this.open();
    }

    private async open() {
        this.file = await zip.loadAsync(this.data);
        // console.log(this.file)

        if (Object.keys(this.file.files).length === 0) {
            console.log(new Error('No files in archive'));
            return;
        }

        await this.validateMimeTipe();
        await this.validateRootFiles();
        await this.parseRootFile();

        await this.compileText();

        // this.file.filter((path, file) => file.name)

        return this.file;
    }

    private findFile(filename: string) {
        const result = this.file.filter(
            (path, file) => file.name.toLowerCase() === filename.toLowerCase()
        );
        if (result.length === 0) {
            return null;
        }
        return result[0];
    }

    private async validateMimeTipe() {
        this.mimeFile = this.findFile('mimetype');
        if (!this.mimeFile) {
            console.log(new Error('No mimetype file in archive'));
            return;
        }

        const text = await this.mimeFile.async('text');

        if (text.toLowerCase().trim() !== 'application/epub+zip') {
            console.log(new Error('Unsupported mime type'));
            return;
        }
    }

    private async validateRootFiles() {
        this.containerFile = this.findFile('meta-inf/container.xml');
        if (!this.containerFile) {
            console.log(new Error('No container file in archive'));
            return;
        }

        const xmlData = await this.containerFile.async('text');
        const parsedXML = parser.parse(xmlData, { ignoreAttributes: false });

        if (
            !parsedXML.container.rootfiles ||
            !parsedXML.container.rootfiles.rootfile
        ) {
            console.log(new Error('No rootfiles found'));
            return;
        }

        const rootFileInfo = parsedXML.container.rootfiles.rootfile;
        let filename: string;

        if (rootFileInfo['@_media-type'] !== 'application/oebps-package+xml') {
            console.log(new Error('Rootfile in unknown format'));
            return;
        }

        filename = rootFileInfo['@_full-path'];

        if (!filename) {
            console.log(new Error('Empty rootfile'));
            return;
        }

        this.rootFile = this.findFile(filename);
        if (!this.rootFile) {
            console.log(new Error('Rootfile not found from archive'));
            return;
        }
    }

    private async parseRootFile() {
        if (!this.rootFile) {
            return;
        }

        const text = await this.rootFile.async('text');
        const XMLData = parser.parse(text, {
            ignoreAttributes: false,
            ignoreNameSpace: true,
            attributeNamePrefix: '',
        });

        for (const [key, value] of Object.entries(XMLData.package)) {
            if (key === 'metadata') {
                this.parseMetadata(value);
            } else if (key === 'manifest') {
                await this.parseManifest(value);
            } else if (key === 'spine') {
                this.parseSpine(value);
            } else if (key === 'guide') {
                await this.parseGuide(value);
            }
        }
    }

    private parseMetadata(metadata: any) {
        console.log(metadata);

        if (Array.isArray(metadata.identifier)) {
            for (const item of metadata.identifier) {
                this.metadata.id = item['#text'];
                break;
            }
        } else {
            this.metadata.id = metadata.identifier['#text'];
        }

        this.metadata.creator = metadata.creator;
        this.metadata.title = metadata.title;
        this.metadata.description = metadata.description;
        this.metadata.date = metadata.date;
        this.metadata.language = metadata.language;
        this.metadata.publisher = metadata.publisher;
        this.metadata.title = metadata.title;
    }

    private async parseManifest(manifest: any) {
        const path = this.rootFile?.name.split('/');
        path?.pop();

        const items: any = {};

        for (const item of manifest.item) {
            if (item['media-type'] === 'application/xhtml+xml') {
                const href = path?.concat([item.href]).join('/');

                const file = this.findFile(href!);
                const r = await file?.async('text');
                const text = new DOMParser().parseFromString(r!, 'text/xml')
                    .documentElement.textContent;

                items[item.id] = text?.trim();
            }
        }

        this.items = items;
    }

    private parseSpine(spine: any) {
        if (spine.itemref) {
            for (const { idref } of spine.itemref) {
                this.flow.push(idref);
            }
        }
    }

    private async parseGuide(guide: any) {
        if (!guide.reference || guide.reference.type !== 'cover') {
            return;
        }

        const path = this.rootFile?.name.split('/');
        path?.pop();
        const path_str = path?.join('/');

        const href = path?.concat([guide.reference.href]).join('/');

        if (!href) {
            return;
        }
        const file = this.findFile(href);

        if (!file) {
            return;
        }

        const data = await file.async('blob');

        this.cover = URL.createObjectURL(data);
    }

    private async compileText() {
        const outputText = [];

        for (const id of this.flow) {
            outputText.push((this.items as any)[id]);
        }

        this.compiled = outputText.join(' ');
    }
}

export default EPub;
