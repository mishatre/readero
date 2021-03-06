import { ComponentStory, ComponentMeta } from '@storybook/react';

import BookReader from '.';
import Providers from '../../providers';

import 'styles/index.scss';

export default {
    title: 'Reader/BookReader',
    component: BookReader,
} as ComponentMeta<typeof BookReader>;

const Template: ComponentStory<typeof BookReader> = (args) => (
    <Providers>
        <BookReader {...args} />
    </Providers>
);

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et scelerisque nulla. Maecenas mollis erat porttitor, mattis elit eget, viverra dolor. Curabitur luctus et tortor et dapibus. Ut pharetra euismod vehicula. Maecenas quis rhoncus erat. Praesent elementum ullamcorper nibh. Donec sit amet leo auctor, posuere purus sit amet, sagittis nunc. Etiam finibus consequat nunc, vitae pretium lacus mattis non. Pellentesque porta turpis interdum sodales viverra. Curabitur tincidunt sagittis nibh sed posuere. Nulla eu fermentum libero. Mauris pretium tincidunt felis, quis luctus purus scelerisque id. Curabitur sagittis vitae ex nec feugiat.;`;
const textArray = new Array(100).fill(text);

export const Default = Template.bind({});
Default.args = {
    info: {
        id: '123',
        title: 'Тот кто хочет выжить',
        cover: false,

        totalWords: textArray.reduce((acc, v) => acc + v.split(' ').length, 0),
    },
    words: textArray,
};
