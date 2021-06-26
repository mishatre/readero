import { useEffect, useState } from "react";

let canvasCtx: CanvasRenderingContext2D | null = null;

function measureFont(fontFamily: string, fontSize: number) {

    if(!canvasCtx) {
        canvasCtx = document.createElement("canvas").getContext("2d");
    }

    if(canvasCtx) {
        const text = "B";
        canvasCtx.font = `${fontSize}px ${fontFamily}`;
        canvasCtx.textBaseline = 'top';
        const textMetrics = canvasCtx.measureText(text);
        const width = Math.abs(textMetrics.actualBoundingBoxLeft) + Math.abs(textMetrics.actualBoundingBoxRight);

        // console.log(width / text.length)
        return width / text.length;
    }
    
    return 0;
}

function useFontWidth(fontFamily: string, fontSize: number) {
    const [fontWidth, setFontWidth] = useState(measureFont(fontFamily, fontSize));
    useEffect(() => {
        setFontWidth(measureFont(fontFamily, fontSize));
    }, [fontFamily, fontSize]);

    return fontWidth;
}

export default useFontWidth;