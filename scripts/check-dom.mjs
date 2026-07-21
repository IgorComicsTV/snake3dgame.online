import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
const htmlIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
const requiredIds = new Set(
  [...source.matchAll(/(?<![.\w])get(?:<[^>]+>)?\('([^']+)'\)/g)].map((match) => match[1]),
);
const missingIds = [...requiredIds].filter((id) => !htmlIds.has(id));

if (missingIds.length > 0) {
  console.error(`Missing required HTML elements: ${missingIds.map((id) => `#${id}`).join(', ')}`);
  process.exit(1);
}

console.log(`DOM contract valid: ${requiredIds.size} required elements found.`);
