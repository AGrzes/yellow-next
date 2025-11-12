import { LabelDisplay } from './label-display'
import type { Meta, StoryFn } from '@storybook/react-vite'

export default {
  title: 'Components/LabelDisplay',
  component: LabelDisplay,
} as Meta<typeof LabelDisplay>

const Template: StoryFn<typeof LabelDisplay> = (args) => <LabelDisplay {...args} />

export const Default = Template.bind({})
Default.args = {
  labelKey: 'Priority',
  labelValue: 'High',
}
