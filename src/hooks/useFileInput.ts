import { useCallback } from 'react';

function useFileInput(options: any, callback: (files: File[]) => void) {
    const onAction = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = (event) => {
            if (!event.target || (event.target as any).files.length === 0) {
                return callback([]);
            }
            callback((event.target as any).files);
        };
        input.click();
    }, [callback]);

    return onAction;
}

export default useFileInput;
