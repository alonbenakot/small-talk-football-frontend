import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      // An explicit `include` makes coverage report against every matching
      // source file, not only the ones a test happens to import — otherwise
      // untested modules drop out of the denominator and inflate the result.
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/**/models/**',
        'src/vite-env.d.ts',
        'src/main.tsx',
      ],
    },
  },
})
