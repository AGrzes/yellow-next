import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      entryRoot: 'src',
      tsconfigPath: './tsconfig.app.json',
      include: ['src/index.ts'],
      exclude: ['**/*.story.*', '**/story-helpers.*'],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MantineRenderers',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: [
        '@jsonforms/core',
        '@jsonforms/react',
        '@mantine/core',
        '@mantine/dates',
        '@mantine/hooks',
        'react',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
    },
  },
})
