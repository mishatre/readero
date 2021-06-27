import { useMemo } from 'react';

let canvasCtx: CanvasRenderingContext2D | null = null;

function measureFont(fontFamily: string, fontSize: number) {
    if (!canvasCtx) {
        canvasCtx = document.createElement('canvas').getContext('2d');
    }

    if (canvasCtx) {
        const text = 'B';
        canvasCtx.font = `${fontSize}px ${fontFamily}`;
        canvasCtx.textBaseline = 'top';
        const textMetrics = canvasCtx.measureText(text);
        const width =
            Math.abs(textMetrics.actualBoundingBoxLeft) +
            Math.abs(textMetrics.actualBoundingBoxRight);
        return width / text.length;
    }

    return 0;
}

function useFontWidth(fontFamily?: string, fontSize?: number) {
    return useMemo(() => {
        if (fontFamily && fontSize) {
            return measureFont(fontFamily, fontSize);
        }
        return 0;
    }, [fontFamily, fontSize]);
}

export default useFontWidth;
