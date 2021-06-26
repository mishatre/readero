import { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { FixedSizeList as List } from 'react-window';

import useElementSize from 'hooks/useElementSize';
import useWrappedTextToArray from 'hooks/useWrappedTextToArray';

import styles from './styles.module.scss';
import { useSettings } from 'Providers/Settings';
import useFontWidth from 'hooks/useFontWidth';

interface IBookRenderProps {
    mode: 'view' | 'play' | 'pause';
    text: string;
    currentIndex: number;
    onCurrentIndexChange?: (index: number) => void;
}

function wrapText(text: string, maxWidth: number) {
    if(maxWidth === 0) {
        return [];
    }
    const words = text.split(' ');
    const rows = [];
    let bufferRow = [];
    for(const word of words) {
        bufferRow.push(word);
        if(bufferRow.join(' ').length > maxWidth) {
            bufferRow.shift();
            // console.log(maxWidth, bufferRow.join(' ').length)
            rows.push(bufferRow.join(' '));
            bufferRow = [];
        }        
    }

    return rows;    
}

function useWrappedText(text: string, maxWidth: number) {
    const [items, setItems] = useState(wrapText(text, maxWidth)); 
    useEffect(() => {
        setItems(wrapText(text, maxWidth));
    }, [text, maxWidth]);
    return items;
}

const BookRender = ({
    mode,
    text,
    currentIndex,
    onCurrentIndexChange,
}: IBookRenderProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const listRef = useRef<List>(null);
    const { height, width } = useElementSize(ref);
    const { settings } = useSettings();

    const fontWidth = useFontWidth('Consolas', 16)
    const rows = useWrappedText(text, Math.floor((width - 60) / fontWidth));
    // console.log(width, fontWidth, Math.floor(width / fontWidth))



    // const rows = useWrappedTextToArray(text, settings.fontFamily, width);

    const [{ currentRowIndex, currentRowWordIndex }, setIndex] = useState({
        currentRowIndex: -1,
        currentRowWordIndex: -1,
    });

    useEffect(() => {
        let currentRowIndex = -1;
        let currentRowWordIndex = -1;
        let acc = 0;
        let prevAcc = 0;
        for (let i = 0; i < rows.length; i++) {
            const rowArray = rows[i].split(' ');
            acc += rowArray.length - 1;
            if (acc > currentIndex) {
                currentRowIndex = i;
                currentRowWordIndex = currentIndex - prevAcc;
                break;
            }
            prevAcc = acc;
        }
        if (listRef.current) {
            listRef.current.scrollToItem(currentRowIndex, 'smart');
        }
        setIndex({
            currentRowIndex,
            currentRowWordIndex,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode === 'view', rows]);

    const onRowClick = useCallback(
        (rowIndex: number, wordIndex) => {
            if (onCurrentIndexChange) {
                const index = rows
                    .slice(0, rowIndex)
                    .reduce((acc, v) => acc + v.split(' ').length - 1, 0);
                setIndex({
                    currentRowIndex: rowIndex,
                    currentRowWordIndex: wordIndex,
                });
                onCurrentIndexChange(index + wordIndex);
            }
        },
        [onCurrentIndexChange, rows]
    );

    if (mode !== 'view') {
        return null;
    }

    return (
        <div
            ref={ref}
            className={styles.container}
            style={{
                fontFamily: settings.fontFamily,
            }}
        >
            <List
                ref={listRef}
                height={height}
                width={width}
                itemSize={24}
                itemCount={rows.length}
                className={styles.list}
                overscanCount={20}
                initialScrollOffset={-500}
            >
                {({ style, index }) => {
                    const rowArray = rows[index].split(' ');
                    return (
                        <div className={styles.row} style={style}>
                            {rowArray.map((item, wordIndex) => (
                                <span
                                    key={(index + 1) * wordIndex}
                                    onClick={() => onRowClick(index, wordIndex)}
                                    className={cn({
                                        [styles.selected]:
                                            index === currentRowIndex &&
                                            wordIndex === currentRowWordIndex,
                                    })}
                                >
                                    {' ' + item + ' '}
                                </span>
                            ))}
                        </div>
                    );
                }}
            </List>
        </div>
    );
};

export default BookRender;
