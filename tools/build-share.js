/**
 * Build a single-file copy of the landing page for sharing as a claude.ai
 * Artifact: CSS and JS inlined, every local image and video embedded as a
 * data URI, <picture> collapsed to one WebP each. The Artifact host supplies
 * the document wrapper, so the output starts at <title>, not <!DOCTYPE>.
 *
 * Usage: node tools/build-share.js <out.html>
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'share.html');

const MIME = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.svg': 'image/svg+xml' };
const cache = new Map();
let bytes = 0;
function dataUri(rel) {
  if (cache.has(rel)) return cache.get(rel);
  const file = path.join(ROOT, rel);
  const buf = fs.readFileSync(file);
  bytes += buf.length;
  const uri = `data:${MIME[path.extname(rel).toLowerCase()]};base64,${buf.toString('base64')}`;
  cache.set(rel, uri);
  return uri;
}

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
let css = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');

/* 1. <picture>: keep one WebP, embedded. Wide 16:9 photographs get the 1600
   candidate; portrait cards get 900 or under, which is what they render at. */
html = html.replace(/<picture>([\s\S]*?)<\/picture>/g, (_, inner) => {
  const srcset = (inner.match(/srcset="([^"]+)"/) || [])[1] || '';
  const candidates = srcset.split(',').map((s) => s.trim().split(/\s+/)).map(([u, w]) => ({ u, w: parseInt(w, 10) }));
  const largest = Math.max(...candidates.map((c) => c.w));
  const cap = largest >= 2400 ? 1600 : 900;
  const pick = candidates.filter((c) => c.w <= cap).sort((a, b) => b.w - a.w)[0] || candidates[0];
  let img = inner.match(/<img[\s\S]*?>/)[0];
  img = img.replace(/src="[^"]+"/, `src="${dataUri(pick.u)}"`).replace(/width="\d+" height="\d+"/, '');
  return img;
});

/* 2. Plain images (fleet thumbs) and videos. */
html = html.replace(/src="(assets\/[^"]+\.(?:webp|jpg|png))"/g, (_, rel) => `src="${dataUri(rel)}"`);
html = html.replace(/data-src="(assets\/[^"]+\.mp4)"/g, (_, rel) => `data-src="${dataUri(rel)}"`);

/* 3. CSS asset references. */
css = css.replace(/url\("(assets\/[^"]+)"\)/g, (_, rel) => `url("${dataUri(rel)}")`);

/* 4. Assemble: title + fonts + style + arming script + body + script. */
const title = '<title>Apex Driver</title>';
const fonts = html.match(/<link href="https:\/\/fonts\.googleapis\.com[^>]+>/)[0];
const arm = html.match(/<script>\s*\/\* Arms[\s\S]*?<\/script>/)[0];
const body = html.match(/<body>([\s\S]*)<\/body>/)[1]
  .replace(/<script src="script\.js" defer><\/script>/, '');

const out = [
  title,
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  fonts,
  `<style>\n${css}\n</style>`,
  arm,
  body,
  `<script>\n${js}\n</script>`,
].join('\n');

fs.writeFileSync(OUT, out);
console.log(`${OUT}: ${(out.length / 1048576).toFixed(2)} MB (${(bytes / 1048576).toFixed(2)} MB of media)`);
