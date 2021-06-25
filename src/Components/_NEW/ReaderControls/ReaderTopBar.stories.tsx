import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ReaderTopBar from '.';

export default {
  title: 'Reader/ReaderTopBar',
  component: ReaderTopBar,
} as ComponentMeta<typeof ReaderTopBar>;

const Template: ComponentStory<typeof ReaderTopBar> = (args) => <ReaderTopBar {...args}/>;

export const Default = Template.bind({});
Default.args = {
};
