
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ReaderStatusBar from '.';

export default {
    title: 'Reader/ReaderStatusBar',
    component: ReaderStatusBar,
} as ComponentMeta<typeof ReaderStatusBar>;

const Template: ComponentStory<typeof ReaderStatusBar> = (args) => (
    <ReaderStatusBar {...args} />
);

export const Default = Template.bind({});
Default.args = {
    totalWords: 10000,
    currentWord: 5000,
};

// export const LoggedOut = Template.bind({});
// LoggedOut.args = {};
