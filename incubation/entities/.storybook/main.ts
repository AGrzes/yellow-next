import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.story.@(js|jsx|mjs|ts|tsx)', '../e2e/**/*.story.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@chromatic-com/storybook'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      optimizeDeps: {
        exclude: ['pouchdb', 'levelup'],
      },
      resolve: {
        alias: {
          levelup: '/.storybook/empty-levelup.ts',
        },
      },
    }),
  core: {
    disableTelemetry: true,
  },
}
export default config
