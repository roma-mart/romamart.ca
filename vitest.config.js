import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    dir: 'src',
    include: [
      '**/*.{test,spec}.?(c|m)[jt]s?(x)',
      '**/__tests__/**/*.{js,jsx}'
    ],
    setupFiles: './src/test/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{js,jsx}',
        '**/__tests__/**',
      ],
    },
  },
});
