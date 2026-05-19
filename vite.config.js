import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/Coursework_Barakholka/',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: false,
    minify: 'esbuild',
  },
});