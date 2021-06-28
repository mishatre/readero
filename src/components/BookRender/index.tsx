import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';

import useElementSize from 'hooks/useElementSize';

import Provider from './context';

import { IFontInfo } from 'types/fontInfo';

import styles from './styles.module.scss';
import ListItem from './ListItem';

interface IBookRenderProps {
    mode: 'view' | 'play' | 'pause';
    words: string[];
    width: number;
    currentIndex: number;
    onCurrentIndexChange?: (index: number) => void;
    maxCharsPerRow: number;
    fontInfo: IFontInfo;
}

function wrapText(words: string[], maxWidth: number) {
    if (maxWidth === 0) {
        return [];
    }

    const rows = [];
    let index = 0;

    let bufferLength = 0;

    let i = 0;
    let startIndex = 0;
    let l = words.length;
    while (i < l) {
        const currWordLength = words[i].length;
        if (bufferLength + currWordLength > maxWidth) {
            rows.push({
                index,
                startIndex: startIndex,
                endIndex: i,
            });
            index += i - startIndex;
            bufferLength = 0;
            startIndex = i;
        }
        bufferLength += currWordLength + 1;
        ++i;
    }

    return rows;
}

const BookRender = ({
    mode,
    words,
    width,
    currentIndex,
    onCurrentIndexChange,
    maxCharsPerRow,
    fontInfo,
}: IBookRenderProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const listRef = useRef<List>(null);
    const { height } = useElementSize(ref);

    const rows = useMemo(() => wrapText(words, maxCharsPerRow), [
        words,
        maxCharsPerRow,
    ]);

    useEffect(() => {
        if (listRef.current) {
            let rowIndex = -1;
            for (let i = 0; i < rows.length; i++) {
                if (currentIndex < rows[i].index) {
                    rowIndex = i === 0 ? 0 : i - 1;
                    break;
                }
            }
            if (rowIndex !== -1) {
                listRef.current.scrollToItem(rowIndex, 'smart');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode === 'view', rows]);

    const onRowClick = useCallback(
        (rowIndex: number, wordIndex) => {
            onCurrentIndexChange?.(rows[rowIndex].index + wordIndex);
        },
        [onCurrentIndexChange, rows]
    );

    const contextValue = useMemo(
        () => ({
            words,
            rows,
            currentIndex,
            onRowClick,
        }),
        [words, rows, currentIndex, onRowClick]
    );

    if (mode !== 'view') {
        return null;
    }

    return (
        <div
            ref={ref}
            className={styles.container}
            style={{
                fontFamily: fontInfo.fontFamily,
                fontSize: fontInfo.fontSize,
            }}
        >
            <Provider value={contextValue}>
                <List
                    ref={listRef}
                    height={height}
                    width={width}
                    itemSize={20}
                    itemCount={rows.length}
                    className={styles.list}
                    overscanCount={20}
                >
                    {ListItem}
                </List>
            </Provider>
        </div>
    );
};

export default BookRender;
