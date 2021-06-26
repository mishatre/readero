import { throttle } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import getLineBreaks from '../utils/libeBreaks';

function useWrappedTextToArray(text: string, fontFamily: string, width: number) {
    const [data, set] = useState<string[]>([]);
    const throttled = useRef(
        throttle((text: string, width: number) => {
            const el = document.createElement('div');
            el.innerText = text;
            el.style.zIndex = '-999';
            el.style.top = '0';
            el.style.left = '0';
            el.style.overflow = 'hidden';
            el.style.position = 'absolute';
            el.style.visibility = 'hidden';
            el.style.fontFamily = fontFamily;
            el.style.fontSize = '16px';
            el.style.width = `${width - 20}px`;
            document.getElementById('root')?.appendChild(el);
            set(getLineBreaks(el.childNodes[0]));
            document.getElementById('root')?.removeChild(el);
        }, 1000)
    );

    useEffect(() => {
        throttled.current(text, width);
    }, [text, width]);

    return data;
}

export default useWrappedTextToArray;
