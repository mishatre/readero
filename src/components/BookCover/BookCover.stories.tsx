import { ComponentStory, ComponentMeta } from '@storybook/react';

import BookCover from '.';

// import 'styles/index.scss';

export default {
    title: 'Reader/BookCover',
    component: BookCover,
} as ComponentMeta<typeof BookCover>;

const Template: ComponentStory<typeof BookCover> = (args) => (
    <div style={{ margin: '16px' }}>
        <BookCover {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    title: 'Каникулы',
    creator: 'Рей Дуглас Брэдберри',
    cover: '#995621'
};
