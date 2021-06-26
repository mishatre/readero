import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ReaderControls from '.';

export default {
  title: 'Reader/ReaderControls',
  component: ReaderControls,
} as ComponentMeta<typeof ReaderControls>;

const Template: ComponentStory<typeof ReaderControls> = (args) => <ReaderControls {...args}/>;

export const Default = Template.bind({});
Default.args = {
};
