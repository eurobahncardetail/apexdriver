// Builds the scroll-driven sun-ray layer from the Kling render.
//   1. ffmpeg: N frames from the clip at its native size.
//   2. M = per-pixel minimum across frames (the "no extra light" plate).
//   3. D_i = F_i - M, masked to the ray region, softened, written as
//      assets/v3/rays/rNN.webp at 960 wide. These are added to the still on the page.
//   4. The hero still is re-exported as S' = S - up(D_0) so that S' + D_0 = S:
//      at rest the page looks exactly like the current still, and the light
//      can then both grow and fade as you scroll.
// Usage: node tools/build-rays.js <clip.mp4> <frames> <gain> <blur>
//   used on 2026-09-03: node tools/build-rays.js assets/v3/raw/hero-rays.mp4 40 3.5 7
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
// Needs sharp and ffmpeg-static: set RAYS_NODE_MODULES to a folder that has them (see README).
const NM = process.env.RAYS_NODE_MODULES || path.join(__dirname, 'node_modules');
const sharp = require(NM + '/sharp');
const ffmpeg = require(NM + '/ffmpeg-static');
const REPO = path.join(__dirname, '..');
const SCR = path.join(REPO, 'assets/v3/raw/rays-work'); // frames and previews, git-ignored
fs.mkdirSync(SCR, { recursive: true });

const clip = process.argv[2];
const N = parseInt(process.argv[3] || '40', 10);
const GAIN = parseFloat(process.argv[4] || '1');
const BLUR = parseFloat(process.argv[5] || '1.6');
const work = path.join(SCR, 'frames');
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });

async function main() {
  // 1. frames, evenly spaced across the clip.
  let info=''; try { execFileSync(ffmpeg, ['-hide_banner', '-i', clip], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { info = String(e.stderr); }
  console.log(info.split('\n').filter(l => /Stream|Duration/.test(l)).join('\n'));
  const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(info);
  const dur = (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]);
  const fps = N / dur;
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-i', clip, '-vf', 'fps=' + fps.toFixed(4), '-frames:v', String(N), path.join(work, 'f%03d.png')]);
  const files = fs.readdirSync(work).filter(f => f.endsWith('.png')).sort().slice(0, N);
  console.log('frames:', files.length);

  const meta = await sharp(path.join(work, files[0])).metadata();
  const W = meta.width, H = meta.height, C = 3;
  const bufs = [];
  for (const f of files) bufs.push(await sharp(path.join(work, f)).removeAlpha().raw().toBuffer());

  // 2. min plate.
  const M = Buffer.alloc(W * H * C, 255);
  for (const b of bufs) for (let i = 0; i < M.length; i++) if (b[i] < M[i]) M[i] = b[i];

  // Mask: keep the light, drop the leaf jitter. Built from the plate's own brightness
  // (rays live in bright pixels) and a soft window over the canopy and road where
  // the beams fall; everything else is faded out. Values 0..1 per pixel.
  const mask = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const l = (M[i * C] * 0.3 + M[i * C + 1] * 0.59 + M[i * C + 2] * 0.11) / 255;
    // brightness term: bright plate pixels pass, dark ones (car, trunks) are damped.
    const bt = Math.min(1, Math.max(0, (l - 0.30) / 0.35));
    // window: from the canopy at top-right, down across the road, fading to the left.
    const fx = x / W, fy = y / H;
    const wx = Math.min(1, Math.max(0, (fx - 0.30) / 0.30));
    const wy = 1 - Math.min(1, Math.max(0, (fy - 0.78) / 0.22));
    mask[i] = bt * wx * wy;
  }

  const outDir = path.join(REPO, 'assets/v3/rays');
  fs.mkdirSync(outDir, { recursive: true });
  for (const f of fs.readdirSync(outDir)) fs.unlinkSync(path.join(outDir, f));

  // 3. difference layers.
  const diffs = [];
  let total = 0, maxMean = 0;
  for (let k = 0; k < bufs.length; k++) {
    const b = bufs[k];
    const D = Buffer.alloc(W * H * C);
    let sum = 0;
    for (let i = 0; i < W * H; i++) {
      const mk = mask[i];
      for (let c = 0; c < C; c++) {
        const v = (b[i * C + c] - M[i * C + c]) * mk * GAIN;
        D[i * C + c] = v < 0 ? 0 : v > 255 ? 255 : v;
        sum += D[i * C + c];
      }
    }
    maxMean = Math.max(maxMean, sum / (W * H * C));
    diffs.push(D);
    const out = await sharp(D, { raw: { width: W, height: H, channels: C } })
      .blur(BLUR)
      .resize(960)
      .webp({ quality: 62, alphaQuality: 0, smartSubsample: true })
      .toBuffer();
    total += out.length;
    fs.writeFileSync(path.join(outDir, 'r' + String(k).padStart(2, '0') + '.webp'), out);
  }
  console.log('layers:', diffs.length, 'total KB:', (total / 1024).toFixed(0), 'max mean lift:', maxMean.toFixed(2));

  // 4. the still minus D_0 (soft, upscaled to the still's size).
  const stillPath = path.join(REPO, 'assets/v3/hero-ridge-2400.jpg');
  const still = sharp(stillPath);
  const sm = await still.metadata();
  const S = await still.removeAlpha().raw().toBuffer();
  const D0 = await sharp(diffs[0], { raw: { width: W, height: H, channels: C } }).blur(BLUR).resize(sm.width, sm.height, { fit: 'fill' }).raw().toBuffer();
  const S2 = Buffer.alloc(S.length);
  for (let i = 0; i < S.length; i++) { const v = S[i] - D0[i]; S2[i] = v < 0 ? 0 : v; }
  const base = sharp(S2, { raw: { width: sm.width, height: sm.height, channels: C } });
  const outs = [
    ['hero-ridge-2400.webp', 2400, 'webp', 78], ['hero-ridge-1600.webp', 1600, 'webp', 78], ['hero-ridge-900.webp', 900, 'webp', 76],
    ['hero-ridge-2400.jpg', 2400, 'jpeg', 84]
  ];
  // Keep the untouched originals once, so this is reversible.
  const keep = path.join(REPO, 'assets/v3/raw/hero-ridge-still-original');
  fs.mkdirSync(keep, { recursive: true });
  for (const [name] of outs) { const src = path.join(REPO, 'assets/v3', name); const dst = path.join(keep, name); if (!fs.existsSync(dst)) fs.copyFileSync(src, dst); }
  for (const [name, w, fmt, q] of outs) {
    let p = base.clone().resize(w);
    p = fmt === 'webp' ? p.webp({ quality: q }) : p.jpeg({ quality: q, mozjpeg: true });
    const buf = await p.toBuffer();
    const dst = path.join(REPO, 'assets/v3', name);
    for (let t = 0; t < 8; t++) { try { fs.writeFileSync(dst, buf); break; } catch (e) { if (t === 7) throw e; await new Promise(r => setTimeout(r, 400)); } }
    console.log(name, (buf.length / 1024).toFixed(0) + ' KB');
  }
  // Preview composites for a visual check: rest (S' + D_0), and the brightest layer.
  const D0s = await sharp(diffs[0], { raw: { width: W, height: H, channels: C } }).blur(BLUR).resize(1200).raw().toBuffer();
  const Sp = await base.clone().resize(1200).raw().toBuffer();
  const rest = Buffer.alloc(Sp.length);
  for (let i = 0; i < Sp.length; i++) rest[i] = Math.min(255, Sp[i] + D0s[i]);
  await sharp(rest, { raw: { width: 1200, height: Math.round(1200 * sm.height / sm.width), channels: C } }).jpeg({ quality: 85 }).toFile(path.join(SCR, 'preview-rest.jpg'));
  let bi = 0, bs = 0; diffs.forEach((d, k) => { let s = 0; for (let i = 0; i < d.length; i += 97) s += d[i]; if (s > bs) { bs = s; bi = k; } });
  const Dbs = await sharp(diffs[bi], { raw: { width: W, height: H, channels: C } }).blur(BLUR).resize(1200).raw().toBuffer();
  const bright = Buffer.alloc(Sp.length);
  for (let i = 0; i < Sp.length; i++) bright[i] = Math.min(255, Sp[i] + Dbs[i]);
  await sharp(bright, { raw: { width: 1200, height: Math.round(1200 * sm.height / sm.width), channels: C } }).jpeg({ quality: 85 }).toFile(path.join(SCR, 'preview-bright.jpg'));
  await sharp(diffs[bi], { raw: { width: W, height: H, channels: C } }).blur(BLUR).resize(1200).jpeg({ quality: 85 }).toFile(path.join(SCR, 'preview-layer.jpg'));
  console.log('brightest layer index', bi);
}
main().catch(e => { console.error(e); process.exit(1); });
