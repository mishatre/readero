import { IFontInfo } from "types/fontInfo";

export function createFontString(fontInfo: IFontInfo): string {
	return doCreateFontString('normal', fontInfo.fontWeight, fontInfo.fontSize, fontInfo.lineHeight, fontInfo.fontFamily);
}

function doCreateFontString(fontStyle: string, fontWeight: string, fontSize: number, lineHeight: number, fontFamily: string): string {
	// The full font syntax is:
	// style | variant | weight | stretch | size/line-height | fontFamily
	// (https://developer.mozilla.org/en-US/docs/Web/CSS/font)
	// But it appears Edge and IE11 cannot properly parse `stretch`.
	return `${fontStyle} normal ${fontWeight} ${fontSize}px / ${lineHeight}px ${fontFamily}`;
}