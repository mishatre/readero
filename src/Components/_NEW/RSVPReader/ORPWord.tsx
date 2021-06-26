import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';

import clamp from '../../../utils/clamp';
import styles from './styles.module.scss';

interface IORPWordProps {
    word: string;
}

function getORPPos(word: string) {
    var length = word.length;
    while ('\n,.?!:;"'.indexOf(word[--length]) !== -1);
    switch (++length) {
        case 0:
        case 1:
            return 0;
        case 2:
        case 3:
            return 1;
        default:
            return Math.floor(length / 2) - 1;
    }
}

const ORPWord = ({ word }: IORPWordProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const [maxOffset, setMaxOffset] = useState(5);

    useEffect(() => {
        const maxWordsCount = Math.floor(
            (ref.current?.offsetWidth || 0) / 28.9233
        );
        setMaxOffset(Math.ceil((maxWordsCount * 2 - 1) / 4) + 1 - 2);
    }, []);

    const orp = Math.ceil((word.length - 1) / 4) + 1;

    return (
        <div
            ref={ref}
            style={{
                textAlign: 'left',
                fontFamily: 'Lucida console',
                lineHeight: '72px',
            }}
        >
            {''.padStart(maxOffset - orp, '\u00A0')}
            {Array.from(word).map((v, i) => (
                <span
                    key={i}
                    className={cn({ [styles.orpChar]: i === orp - 1 })}
                >
                    {v}
                </span>
            ))}
        </div>
    );
};

export default ORPWord;
