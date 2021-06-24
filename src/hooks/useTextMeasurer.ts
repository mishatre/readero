import { useCallback } from "react";

const canvasCtx = document.createElement("canvas").getContext("2d");

function useTextMeasurer() {

    const measure = useCallback((fontFamily: string, fontSize: number, text: string) => {
        
        canvasCtx!.font = `${fontSize}px ${fontFamily}`;
        const textMetrics = canvasCtx!.measureText(text);
        const width = Math.abs(textMetrics.actualBoundingBoxLeft) + Math.abs(textMetrics.actualBoundingBoxRight);
        return width;
    }, []);

    return measure;

}

export default useTextMeasurer;