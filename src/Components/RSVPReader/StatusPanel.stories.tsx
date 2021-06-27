import { ComponentStory, ComponentMeta } from '@storybook/react';

import PSVPReader from '.';
import SettingsProvider from 'providers/Settings';

export default {
    title: 'Reader/PSVPReader',
    component: PSVPReader,
} as ComponentMeta<typeof PSVPReader>;

const Template: ComponentStory<typeof PSVPReader> = (args) => (
    <SettingsProvider>
        <PSVPReader {...args} />
    </SettingsProvider>
);

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et scelerisque nulla. Maecenas mollis erat porttitor, mattis elit eget, viverra dolor. Curabitur luctus et tortor et dapibus. Ut pharetra euismod vehicula. Maecenas quis rhoncus erat. Praesent elementum ullamcorper nibh. Donec sit amet leo auctor, posuere purus sit amet, sagittis nunc. Etiam finibus consequat nunc, vitae pretium lacus mattis non. Pellentesque porta turpis interdum sodales viverra. Curabitur tincidunt sagittis nibh sed posuere. Nulla eu fermentum libero. Mauris pretium tincidunt felis, quis luctus purus scelerisque id. Curabitur sagittis vitae ex nec feugiat.;`;

export const Default = Template.bind({});
Default.args = {
    mode: 'view',
    words: text.split(' '),
    initialIndex: 0,
};
