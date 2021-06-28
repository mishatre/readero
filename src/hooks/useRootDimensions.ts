import { useEffect, useState } from 'react';

function useRootDimension() {
    const [dimensions, setDimensions] = useState(() => {
        const rootNode = document.getElementById('root');
        if (rootNode) {
            const { width, height } = rootNode.getBoundingClientRect();
            return { width, height };
        }
    });

    useEffect(() => {
        const rootNode = document.getElementById('root');

        if (rootNode) {
            const callback = (entries: ResizeObserverEntry[]) => {
                if (entries.length > 0) {
                    const { width, height } = entries[0].contentRect;
                    setDimensions({ width, height });
                }
            };
            const observer = new ResizeObserver(callback);
            observer.observe(rootNode, { box: 'content-box' });
        }
    }, []);

    if (!dimensions) {
        return null;
    }

    return dimensions;
}

export default useRootDimension;
