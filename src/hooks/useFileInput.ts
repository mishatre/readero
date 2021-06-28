import { useCallback } from 'react';

const textFormats = [
    '.doc',
    '.docx',
    '.xml',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/epub+zip',
    'text/plain',
    'text/csv',
    'text/html',
].join(',');

function useFileInput(options: any, callback: (files: File[]) => void) {
    const onAction = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = textFormats;
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
