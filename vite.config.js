import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/Portfolio/',
  plugins: [tailwindcss()],
  server: {
    open: true,
    host: true
  },
  build: {
    outDir: 'dist'
  }
});
