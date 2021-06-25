
import styles from './styles.module.scss';

interface IORPWordProps {
    word: string;
}

function getORPPos(word: string){
    var length = word.length;
    while('\n,.?!:;"'.indexOf(word[--length]) !== -1);
    switch(++length) {
      case 0: case 1: return 0;
      case 2: case 3: return 1;
      default: return Math.floor(length / 2) - 1;
    }
}

const ORPWord = ({ word }: IORPWordProps) => {
    const split = getORPPos(word);
    const length = word.length;
    let lpad = '';
    let rpad = '';

    if (length === 2) {
        rpad = "\u00A0";
    } else if (length === 1 || length === 3) {
    } else if (length % 2) {
        lpad = "".padStart(Math.floor(length / 2) - split + 1, "\u00A0");
    } else {
        lpad = "".padStart(Math.floor(length / 2) - split, "\u00A0");
    }
    return (
        <>
            {lpad + word.substr(0, split)}
            <span className={styles.orpChar}>{word.substr(split, 1)}</span>
            {word.substr(split + 1) + rpad}
        </>
    );
}

export default ORPWord;