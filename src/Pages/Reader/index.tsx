
import BookReader from 'Components/BookReader';
import styles from './styles.module.scss';

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et scelerisque nulla. Maecenas mollis erat porttitor, mattis elit eget, viverra dolor. Curabitur luctus et tortor et dapibus. Ut pharetra euismod vehicula. Maecenas quis rhoncus erat. Praesent elementum ullamcorper nibh. Donec sit amet leo auctor, posuere purus sit amet, sagittis nunc. Etiam finibus consequat nunc, vitae pretium lacus mattis non. Pellentesque porta turpis interdum sodales viverra. Curabitur tincidunt sagittis nibh sed posuere. Nulla eu fermentum libero. Mauris pretium tincidunt felis, quis luctus purus scelerisque id. Curabitur sagittis vitae ex nec feugiat.;`;
const textArray = new Array(100).fill(text);

const Reader = () => {

    return (
        <div className={styles.container}>
            <BookReader 
                info={{
                    id: '123',
                    title: 'Тот кто хочет выжить',
                    cover: false,
                
                    totalSentences: 1000,
                    totalWords: textArray.reduce((acc, v) => acc + v.split(' ').length, 0),
                }}
                text={textArray.join(' ')}
            />
        </div>
    );
};

export default Reader;
