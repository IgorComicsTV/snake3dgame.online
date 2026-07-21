import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        howToPlay: resolve(import.meta.dirname, 'how-to-play/index.html'),
        controls: resolve(import.meta.dirname, 'controls/index.html'),
        tips: resolve(import.meta.dirname, 'tips/index.html'),
        mobile: resolve(import.meta.dirname, 'mobile/index.html'),
        faq: resolve(import.meta.dirname, 'faq/index.html'),
        history: resolve(import.meta.dirname, 'history/index.html'),
      },
    },
  },
});
