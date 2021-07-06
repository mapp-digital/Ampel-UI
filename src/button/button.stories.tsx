import React, { ComponentProps } from 'react';

import { Story } from '@storybook/react';

import { Button } from './button';

export default {
    // Defines the menu entry (splitting by '/' for hierarchy)
    title: 'Components/Button',
    // The component to be shown
    component: Button,
    // Used by controls add-on to define argument editors
    argTypes: {
        text: {
            options: ['To click', 'Or not to click'],
            control: { type: 'select' }, // try 'radio'
        },
        disabled: {
            control: 'boolean',
        },
    },
    // Sets configuration of the story/storybook
    parameters: {
        backgrounds: {
            values: [
                { name: 'red', value: '#f00' },
                { name: 'green', value: '#0f0' },
                { name: 'blue', value: '#00f' },
            ],
        },
    },
};

const Template: Story<ComponentProps<typeof Button>> = (args) => <Button {...args} />;

export const FirstStory = Template.bind({});
FirstStory.args = {
    id: 'first',
    text: 'Click me!',
};

export const SecondStory = Template.bind({});
SecondStory.args = { ...FirstStory.args, text: '😄👍😍💯' };

export const ThirdStory = Template.bind({});
ThirdStory.args = { ...FirstStory.args, text: '📚📕📈🤓' };
