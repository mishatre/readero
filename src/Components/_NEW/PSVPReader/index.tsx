
import { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import useAccurateTimer from '../../../hooks/useAccurateTimer';
import clamp from '../../../utils/clamp';
import styles from './styles.module.scss';
import ORPWord from './ORPWord';
import ORPGuideline from './ORPGuideline';

interface IRSVPReaderProps {

    isPlaying: boolean;

    text: string;
    initialIndex?: number;

    fontFamily?: string;
    fontSize?: number;

    wordsPerMinute: number;

    ORP?: boolean;
    ORPGuideLine?: boolean;

}

interface IRSPVReaderState {
    currentWord: string, 
    currentIndex: number, 
    hasNextWord: boolean, 
    items: string[]
}

const RSVPReader = ({

    isPlaying,

    text,
    initialIndex = 0,

    fontFamily = 'Kazemir',
    fontSize = 48,

    wordsPerMinute,
    ORP = true,
    ORPGuideLine = true,
}: IRSVPReaderProps) => {

    const [{ currentWord, currentIndex, hasNextWord, items }, set] = useState<IRSPVReaderState>({
        currentWord: '',
        currentIndex: 0,
        hasNextWord: false,
        items: [],
    });

    useEffect(() => {

        if(!text) {
            return;
        }

        const items = text.split(' ');
        const wordCount = items.length;

        const state = {
            currentWord: '',
            currentIndex: 0,
            hasNextWord: false,
            items,
        }

        if(wordCount > 0) {

            const initial = clamp(0, (initialIndex || 0), wordCount);

            const currentWord = items[initial];

            if(currentWord) {
                state.currentIndex = initial;
                state.currentWord  = currentWord;
                state.hasNextWord  = items.length > initial; 
            }

        }

        set(state);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

    const onTick = useCallback(() => {
        set((currState) => {
            const newState = {...currState}
            const nextWord = currState.items[currState.currentIndex+1];
            if(nextWord) {
                newState.currentWord = nextWord;
                newState.currentIndex++;
                newState.hasNextWord = currState.items.length > newState.currentIndex;
            } else {
                newState.hasNextWord = false;
            }
            return newState;
        });
    }, []);

    const delay = (60 / wordsPerMinute) * 1000;
    useAccurateTimer(isPlaying && hasNextWord, delay, onTick);

    return (
        <div
            className={cn(styles.container, {
                [styles.orp]: ORP,
            })}
            style={{
                fontFamily,
                fontSize: `${fontSize}px`,
            }}
        >
            <ORPGuideline visible={ORPGuideLine}>
                <ORPWord word={currentWord} />
            </ORPGuideline>
        </div>
    )
}

export default RSVPReader;