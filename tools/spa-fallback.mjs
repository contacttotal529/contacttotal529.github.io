// GitHub Pages serves 404.html for any path it has no file for. Every route is prerendered to
// its own index.html, so this only catches genuinely unknown URLs — and it copies the
// prerendered not-found page rather than the home page, so a crawler hitting a dead link sees
// "page not found" instead of home-page content served under a 404 status.
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.argv[2];

if (!outDir) {
  console.error('usage: node tools/spa-fallback.mjs <browser-output-dir>');
  process.exit(1);
}

const prerendered404 = join(outDir, '404', 'index.html');
const source = existsSync(prerendered404) ? prerendered404 : join(outDir, 'index.html');

copyFileSync(source, join(outDir, '404.html'));
console.log(`Wrote ${join(outDir, '404.html')} from ${source}`);
