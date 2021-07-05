import { useCallback, useEffect, useMemo, useRef } from 'react';
import { VariableSizeList as List, VariableSizeListProps } from 'react-window';

import useElementSize from 'hooks/useElementSize';

import Provider from './context';

import { IFontInfo } from 'types/fontInfo';

import styles from './styles.module.scss';
import ListItem from './ListItem';

interface IBookRenderProps {
    mode: 'view' | 'play' | 'pause';
    words: string[];
    paragraphs: [number, number[]][];
    width: number;
    currentIndex: number;
    onCurrentIndexChange?: (index: number) => void;
    maxCharsPerRow: number;
    fontInfo: IFontInfo;
}

function getWrapedRowLinesCount(paragraph: [number, number[]], maxWidth: number) {
    if (maxWidth === 0) {
        return 0;
    }

    let acc = 0;

    let [startIndex, items] = paragraph;

    const totalParagraphWidth = items.reduce((acc, v) => acc + v, 0) + (items.length - 1)
    
    if(totalParagraphWidth <= maxWidth) {
        acc = 1;
    } else {
        let bufferLength = 0;
        let j = 0;
        for(let i = 0; i < items.length; i++) {
            bufferLength += items[i] + 1;
            j++
            if(bufferLength + items[i + 1] >= maxWidth) {
                acc += 1;
                startIndex = startIndex + j;
                bufferLength = 0;
                j = 0;
            }
        }
        if(bufferLength !== 0) {
            acc += 1;
        }
        acc += 1;
    }

    return acc;

}

// function wrapRow(paragraph: [[number, number], number[]], maxWidth: number) {
//     if (maxWidth === 0) {
//         return [];
//     }

//     const rows = [];

//     let [startIndex, endIndex] = paragraph[0];
//     const wordsLength = paragraph[1];

//     const totalParagraphWidth = wordsLength.reduce((acc, v) => acc + v, 0) + (wordsLength.length - 1)
    
//     if(totalParagraphWidth <= maxWidth) {
//         rows.push({
//             start: startIndex,
//             end: endIndex,
//         });
//     } else {
//         let bufferLength = 0;
//         let j = 0;
//         for(let i = 0; i < wordsLength.length; i++) {
//             bufferLength += wordsLength[i] + 1;
//             j++
//             if(bufferLength + wordsLength[i + 1] >= maxWidth) {
//                 rows.push({ start: startIndex, end: startIndex + j });
//                 startIndex = startIndex + j;
//                 bufferLength = 0;
//                 j = 0;
//             }
//         }
//         if(bufferLength !== 0) {
//             rows.push({ start: startIndex, end: startIndex + j });
//             console.log(bufferLength)
//         }
//         rows.push({ start: startIndex + j, end: startIndex + j });
//     }

//     return rows;

// }

// function wrapText(words: string[], paragraphs: [[number, number], number[]][], maxWidth: number) {
//     if (maxWidth === 0) {
//         return [];
//     }
//     maxWidth += 1;

//     const rows = [];
//     rows.push({ start: 0, end: 0 });

//     for(const paragraph of paragraphs) {
//         rows.push(...wrapRow(paragraph, maxWidth));        
//     }


//     // console.log(rows);
//     return rows;

    
//     // let index = 0;

//     // let bufferLength = 0;

//     // let i = 0;
//     // let startIndex = 0;
//     // let l = words.length;
//     // while (i < l) {
//     //     const currWordLength = words[i].length;
//     //     if (bufferLength + currWordLength > maxWidth) {
//     //         rows.push({
//     //             index,
//     //             startIndex: startIndex,
//     //             endIndex: i,
//     //         });
//     //         index += i - startIndex;
//     //         bufferLength = 0;
//     //         startIndex = i;
//     //     }
//     //     bufferLength += currWordLength + 1;
//     //     ++i;
//     // }

//     // return rows as Array<{
//     //     index: number;
//     //     startIndex: number;
//     //     endIndex: number;
//     // }>;
// }

const BookRender = ({
    mode,
    words,
    paragraphs,
    width,
    currentIndex,
    onCurrentIndexChange,
    maxCharsPerRow,
    fontInfo,
}: IBookRenderProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const listRef = useRef<List>(null);
    const { height } = useElementSize(ref);

    useEffect(() => {
        window.onresize = () => {
            listRef.current?.resetAfterIndex(0)
        }
    }, []);

    useEffect(() => {
        if (listRef.current) {
            let rowIndex = -1;
            for (let i = 0; i < paragraphs.length; i++) {
                if (currentIndex < paragraphs[i][0]) {
                    rowIndex = i === 0 ? 0 : i - 1;
                    break;
                }
            }
            if (rowIndex !== -1) {
                listRef.current.scrollToItem(rowIndex, 'center');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode === 'view', paragraphs]);

    const onRowClick = useCallback(
        (rowIndex: number, wordIndex) => {
            onCurrentIndexChange?.(paragraphs[rowIndex][0] + wordIndex);
        },
        [onCurrentIndexChange, paragraphs]
    );

    const contextValue = useMemo(
        () => ({
            words,
            paragraphs,
            currentIndex,
            onRowClick,
        }),
        [words, paragraphs, currentIndex, onRowClick]
    );

    const getItemSize = useCallback((index: number) => {
        const rowsCount = getWrapedRowLinesCount(paragraphs[index], maxCharsPerRow);
        return rowsCount * 17
    }, [paragraphs, maxCharsPerRow]);

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
                    itemSize={getItemSize}
                    itemCount={paragraphs.length}
                    className={styles.list}
                    overscanCount={5}
                >
                    {ListItem}
                </List>
            </Provider>
        </div>
    );
};

export default BookRender;
