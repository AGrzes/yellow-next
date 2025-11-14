import type { Meta, StoryFn } from '@storybook/react-vite'
import { ItemsFilter } from './items-filter'

export default {
  component: ItemsFilter,
} as Meta<typeof ItemsFilter>

const Template: StoryFn<typeof ItemsFilter> = (args) => <ItemsFilter {...args} />

export const Default = Template.bind({})
Default.args = {
  value: {},
}
