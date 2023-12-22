import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['**/*.{test,tests,spec}.{js,mjs,cjs,ts,tsx,mts,cts}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
  server: {
    port: 3008,
  },
  build: {
    lib: {
      entry: path.resolve('src', 'src/components/viewer.tsx'),
      name: 'aleph-r3f',
      fileName: (format) => `aleph-r3f.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});
