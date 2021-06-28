import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ReaderHeader from '.';

export default {
  title: 'Reader/ReaderHeader',
  component: ReaderHeader,
} as ComponentMeta<typeof ReaderHeader>;

const Template: ComponentStory<typeof ReaderHeader> = (args) => <ReaderHeader {...args}/>;

export const Default = Template.bind({});
Default.args = {
};
