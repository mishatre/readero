
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ReaderControls from '.';
import SettingsProvider from 'providers/Settings';

export default {
    title: 'Reader/ReaderControls',
    component: ReaderControls,
} as ComponentMeta<typeof ReaderControls>;

const Template: ComponentStory<typeof ReaderControls> = (args) => (
    <div style={{ margin: '10px', border: '1px solid #000' }}>
        <SettingsProvider>
            <ReaderControls {...args} />
        </SettingsProvider>
    </div>
);

export const Default = Template.bind({});
Default.args = {};
