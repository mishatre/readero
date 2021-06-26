import { useCallback, useEffect, useRef } from 'react';
import cn from 'classnames';
import { FixedSizeList as List } from 'react-window';

import useElementSize from 'hooks/useElementSize';

import { IFontInfo } from 'types/fontInfo';

import styles from './styles.module.scss';

interface IBookRenderProps {
    mode: 'view' | 'play' | 'pause';
    rows: Array<{ index: number; text: string; words: string[]; }>;
    width: number;
    currentIndex: number;
    onCurrentIndexChange?: (index: number) => void;
    fontInfo: IFontInfo,
}

const BookRender = ({
    mode,
    rows,
    width,
    currentIndex,
    onCurrentIndexChange,

    fontInfo,
}: IBookRenderProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const listRef = useRef<List>(null);
    const { height } = useElementSize(ref);

    useEffect(() => {        
        if (listRef.current) {
            let rowIndex = -1;
            for(let i = 0; i < rows.length; i++) {
                if(currentIndex < rows[i].index) {
                    rowIndex = i === 0 ? 0 : i - 1;
                    break;
                }
            }
            if(rowIndex !== -1) {
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

    if (mode !== 'view') {
        return null;
    }

    return (
        <div
            ref={ref}
            className={styles.container}
            style={{
                fontFamily: fontInfo.fontFamily,
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
            >
                {({ style, index }) => {

                    let rowIndex = -1;
                    let colIndex = -1;

                    if(!rows[index+1] || currentIndex < rows[index+1].index) { 
                        rowIndex = index;
                        colIndex = currentIndex - rows[index].index;
                    }

                    return (
                        <div className={styles.row} style={style}>
                            {rows[index].words.map((item, wordIndex) => (
                                <span
                                    key={(index + 1) * wordIndex}
                                    onClick={() => onRowClick(index, wordIndex)}
                                    className={cn({
                                        [styles.selected]:
                                            index === rowIndex &&
                                            wordIndex === colIndex,
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
