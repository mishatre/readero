
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ReaderTopBar from '.';
import SettingsProvider from 'Providers/Settings';

export default {
    title: 'Reader/ReaderTopBar',
    component: ReaderTopBar,
} as ComponentMeta<typeof ReaderTopBar>;

const Template: ComponentStory<typeof ReaderTopBar> = (args) => (
    <SettingsProvider>
        <ReaderTopBar {...args} />
    </SettingsProvider>
);

export const Default = Template.bind({});
Default.args = {};
