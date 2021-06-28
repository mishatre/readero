
import createCtx from 'utils/context';

interface IBookReaderContext {
    words: string[];
    rows: Array<{
        index: number;
        startIndex: number;
        endIndex: number;
    }>;
    currentIndex: number;
    onRowClick: (row: number, col: number) => void;
}

const [useBookRendererContext, Provider] = createCtx<IBookReaderContext>();

export {
    useBookRendererContext,
}

export default Provider;