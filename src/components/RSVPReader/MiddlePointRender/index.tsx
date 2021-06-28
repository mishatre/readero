
import cn from 'classnames';
import { IFontInfo } from 'types/fontInfo';
import styles from './styles.module.scss';

interface IMiddlePointRenderProps {
    fontInfo: IFontInfo;
    word: string;
    highlight: boolean;
}

const breakWordToParts = (word: string) => {
    if (word.length === 1 || word.length === 2) {
        return ['', word, ''];
    }
    const middle = word.length / 2;
    const even = middle % 2 === 0;
    return [
        word.substr(0, middle - (even ? 1 : 0)),
        word.substr(middle - (even ? 1 : 0), even ? 2 : 1),
        word.substr(middle + 1)
    ]
}

const MiddlePointRender = ({
    fontInfo,
    word,
    highlight,
}: IMiddlePointRenderProps) => {
    return (
        <div
            className={cn(styles.container, {
                [styles.highlight]: highlight,
            })}
            style={{
                fontFamily: fontInfo.fontFamily,
                fontSize: `${fontInfo.fontSize}px`,
            }}
        >
            {breakWordToParts(word).map((part, index) => <span key={index}>{part}</span>)}
        </div>
    );
}

export default MiddlePointRender;