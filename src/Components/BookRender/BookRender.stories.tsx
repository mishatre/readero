import { ComponentStory, ComponentMeta } from '@storybook/react';

import BookRender from '.';

export default {
    title: 'Reader/BookRender',
    component: BookRender,
} as ComponentMeta<typeof BookRender>;

const Template: ComponentStory<typeof BookRender> = (args) => (
    <div style={{ height: '90vh', width: '100%', display: 'flex' }}>
        <BookRender {...args} />
    </div>
);

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et scelerisque nulla. Maecenas mollis erat porttitor, mattis elit eget, viverra dolor. Curabitur luctus et tortor et dapibus. Ut pharetra euismod vehicula. Maecenas quis rhoncus erat. Praesent elementum ullamcorper nibh. Donec sit amet leo auctor, posuere purus sit amet, sagittis nunc. Etiam finibus consequat nunc, vitae pretium lacus mattis non. Pellentesque porta turpis interdum sodales viverra. Curabitur tincidunt sagittis nibh sed posuere. Nulla eu fermentum libero. Mauris pretium tincidunt felis, quis luctus purus scelerisque id. Curabitur sagittis vitae ex nec feugiat.;`;

export const Default = Template.bind({});
Default.args = {
    text: new Array(100).fill(text).join(' '),
};
