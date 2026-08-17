// GitHub Pages serves 404.html for any path it has no file for. Copying index.html
// over it lets the Angular router handle deep links (/about) instead of hard-404ing.
import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.argv[2];

if (!outDir) {
  console.error('usage: node tools/spa-fallback.mjs <browser-output-dir>');
  process.exit(1);
}

copyFileSync(join(outDir, 'index.html'), join(outDir, '404.html'));
console.log(`Wrote ${join(outDir, '404.html')}`);
