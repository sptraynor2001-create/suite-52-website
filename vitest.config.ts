/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mtsx,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.git', '.cache'],
    testTimeout: 10000,
    reporter: process.env.CI ? 'verbose' : 'default',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/*.d.ts',
        'src/**/*.config.{ts,js}',
        'src/**/types.ts',
        'src/main.tsx', // Entry point
      ],
      thresholds: {
        statements: 85,  // More realistic
        branches: 75,
        functions: 85,
        lines: 85,
      },
      // Only report uncovered files
      all: true,
      skipFull: false,
    },
  },
})
