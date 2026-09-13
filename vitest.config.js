import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      include: '**/*.{js,jsx,ts,tsx}',
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@theme/SearchBar',
        replacement: path.join(rootDir, 'src/test/mocks/SearchBar.jsx'),
      },
      {
        find: '@docusaurus/Link',
        replacement: path.join(rootDir, 'src/test/mocks/Link.jsx'),
      },
      {
        find: '@docusaurus/theme-common',
        replacement: path.join(rootDir, 'src/test/mocks/theme-common.js'),
      },
      {
        find: '@site',
        replacement: rootDir,
      },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
});
