import { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';

import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import styles from './styles.module.scss';
import useTextMeasurer from '../../hooks/useTextMeasurer';

interface IBookPlayerProps {
    fontFamily?: string;
    fontSize?: number;
    sentences: string[];
    currentIndex: number;
}

function measureFontHeight(fontName: string, fontSize: number) {
    // get the CSS metrics.
    // NB: NO CSS lineHeight value !
    let div = document.createElement('DIV');
    div.id = '__textMeasure';
    div.innerHTML = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ";
    div.style.position = 'absolute';
    div.style.top = '-500px';
    div.style.left = '0';
    div.style.fontFamily = fontName;
    div.style.fontSize = fontSize + 'px';
    document.body.appendChild(div);
    
    const height = div.offsetHeight;
    
    document.body.removeChild(div);

    return height;
}

const SentenceRow = ({ style, data, index }: any) => {
    return (
        <div 
            className={cn(styles.sentenceRow, { [styles.selected]: index === data.currentIndex})} 
            style={style}
        >
            {data.sentences[index]}
        </div>
    );
}

function useTester() {
    const el = document.createElement('div');
    el.style.fontFamily = "Kazemir";
    el.style.fontSize = "16px";
    el.style.display="block";
    el.innerText = "Today he was particularly nervous and worried because something had gone seriously wrong with his job,  which was to see that Arthur Dent’s house got cleared out of the  way before the day was out"
    // console.dir(window.getComputedStyle(el))
}

const VirtualBookPlayer = ({
    fontFamily = 'Kazemir',
    fontSize = 16,
    sentences,
    currentIndex,
}: IBookPlayerProps) => {

    // TODO: Add chapter titles
    const [lineHeight, setLineHeight] = useState(fontSize);
    useEffect(() => {
        setLineHeight(measureFontHeight(fontFamily, fontSize));
    }, [fontFamily, fontSize]);

    useTester();

    const measureText = useTextMeasurer();
    const getItemSize = useCallback((width: number, index: number) => {
        // TODO: Not accurate
        if(index === 2) {
            console.log(Math.ceil(measureText(fontFamily, fontSize, sentences[index])) / width)
        }
        const itemHeight = Math.ceil((Math.ceil(measureText(fontFamily, fontSize, sentences[index]) / width) + 1) * lineHeight);
        return itemHeight;
    }, [sentences, fontSize, fontFamily, measureText]);

    const itemData = useMemo(() => ({
        sentences,
        currentIndex
    }), [sentences, currentIndex]);
    
    return (
        <div 
            className={styles.container}
            style={{
                fontFamily: fontFamily,
                fontSize: `${fontSize}px`,
            }}
        >
            <div className={styles.b}>
                <AutoSizer onResize={() => console.log('resize')}>
                    {({ height, width }) => (
                        <List
                            height={height}
                            width={width}
                            itemData={itemData}
                            estimatedItemSize={fontSize * 1.4}
                            itemSize={getItemSize.bind(null, width)}
                            itemCount={sentences.length}
                            className={styles.list}
                            overscanCount={20}
                            // initialScrollOffset={-500}
                        >
                            {SentenceRow}
                        </List>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
};

export default VirtualBookPlayer;
