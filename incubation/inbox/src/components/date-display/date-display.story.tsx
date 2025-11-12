import type { Meta, StoryFn } from '@storybook/react-vite'
import { DateDisplay } from './date-display'

export default {
  title: 'Components/DateDisplay',
  component: DateDisplay,
} as Meta<typeof DateDisplay>

const Template: StoryFn<typeof DateDisplay> = (args) => <DateDisplay {...args} />

export const Default = Template.bind({})
Default.args = {
  date: new Date().toISOString(),
  highlight: false,
}

export const Highlighted = Template.bind({})
Highlighted.args = {
  date: new Date().toISOString(),
  highlight: true,
}
