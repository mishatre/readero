import cn from 'classnames';

import styles from './styles.module.scss';

interface IORPWordProps {
    word: string;
    maxOffset: number;
}

const ORPWord = ({ word, maxOffset }: IORPWordProps) => {
    const orp = Math.ceil((word.length - 1) / 4) + 1;

    return (
        <div
            style={{
                textAlign: 'left',
                fontFamily: 'Liberation Mono',
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
