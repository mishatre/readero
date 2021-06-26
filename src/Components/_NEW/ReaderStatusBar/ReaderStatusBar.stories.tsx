import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ReaderStatusBar from '.';

export default {
    title: 'Reader/ReaderStatusBar',
    component: ReaderStatusBar,
} as ComponentMeta<typeof ReaderStatusBar>;

const Template: ComponentStory<typeof ReaderStatusBar> = (args) => (
    <ReaderStatusBar {...args} timeLeft={args.timeLeft * 1000} />
);

export const Default = Template.bind({});
Default.args = {
    position: 70,
    timeLeft: 10,
    wordsLeft: 5000,
};

// export const LoggedOut = Template.bind({});
// LoggedOut.args = {};
