import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import StatusPanel from '.';

export default {
  title: 'Reader/StatusPanel',
  component: StatusPanel,
} as ComponentMeta<typeof StatusPanel>;

const Template: ComponentStory<typeof StatusPanel> = (args) => <StatusPanel {...args} timeLeft={args.timeLeft * 1000} />;

export const Default = Template.bind({});
Default.args = {
  position: 70,
  timeLeft: 10,
  wordsLeft: 5000
};

// export const LoggedOut = Template.bind({});
// LoggedOut.args = {};
