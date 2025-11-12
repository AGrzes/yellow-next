import type { Meta, StoryFn } from '@storybook/react-vite'
import { LabelDisplay } from './label-display'

export default {
  component: LabelDisplay,
} as Meta<typeof LabelDisplay>

const Template: StoryFn<typeof LabelDisplay> = (args) => <LabelDisplay {...args} />

export const Default = Template.bind({})
Default.args = {
  labelKey: 'Priority',
  labelValue: 'High',
}
