import { ComponentStory, ComponentMeta } from '@storybook/react';

import BookItem from '.';

export default {
    title: 'Reader/BookItem',
    component: BookItem,
} as ComponentMeta<typeof BookItem>;

const Template: ComponentStory<typeof BookItem> = (args) => (
    <div style={{ margin: '16px' }}>
        <BookItem {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    onBookClick: () => console.log(1),
    onRestClick: () => console.log(1),
    bookInfo: {
        id: '123',
        title: 'Каникулы',
        creator: 'Рей Дуглас Брэдберри',
        cover: '#995621',
        totalWords: 10000,
    },
    currentWord: 5000,
    wordsPerMinute: 320,
    selectable: false,
    selected: false,
};
