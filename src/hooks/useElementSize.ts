import { RefObject, useCallback, useEffect, useState } from 'react';

// See: https://usehooks-typescript.com/react-hook/use-event-listener
// import useEventListener from './useEventListener';

interface Size {
    width: number;
    height: number;
}

function useElementSize<T extends HTMLElement = HTMLDivElement>(
    elementRef: RefObject<T>
): Size {
    const [size, setSize] = useState<Size>({
        width: 0,
        height: 0,
    });

    // Prevent too many rendering using useCallback
    const updateSize = useCallback(() => {
        const node = elementRef?.current;
        if (node) {
            setSize({
                width: node.offsetWidth || 0,
                height: node.offsetHeight || 0,
            });
        }
    }, [elementRef]);

    // Initial size on mount
    useEffect(() => {
        const node = elementRef?.current;
        if (node) {
            const observer = new ResizeObserver(updateSize);
            observer.observe(node, { box: 'content-box' })
            updateSize();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => { }, []);

    // useEventListener('resize', updateSize);

    return size;
}

export default useElementSize;
