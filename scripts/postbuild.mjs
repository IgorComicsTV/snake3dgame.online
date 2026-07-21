import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync(new URL('../dist/play/', import.meta.url), { recursive: true });
copyFileSync(new URL('../dist/index.html', import.meta.url), new URL('../dist/play/index.html', import.meta.url));
