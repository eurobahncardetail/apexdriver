/**
 * Regenerate the car photography in assets/photos/ from the original files.
 *
 * The originals are portrait phone photos and the design specifies 4:3
 * landscape slots, so each is cropped to a 4:3 window positioned CROP_FRAC
 * down the frame — 0.62 is the point that centres the car without clipping
 * the roof. Adjust per-image if a source is swapped.
 *
 * EXIF is deliberately not carried over. sharp omits metadata unless
 * withMetadata() is called, and these originals contain GPS coordinates.
 * Do not add withMetadata() here.
 *
 * Usage:
 *   npm install sharp          (not a project dependency; this is a one-off tool)
 *   node tools/build-photos.js
 */

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Where the untouched originals live. Adjust if they move.
const SRC = path.resolve(__dirname, '..', '..');
const OUT = path.resolve(__dirname, '..', 'assets', 'photos');

const CROP_FRAC = 0.62;

const JOBS = [
  { file: 'IMG_6483.jpeg', name: 'hero-huracan', widths: [1600, 800] },
  { file: 'IMG_6487.jpeg', name: 'huracan-01',   widths: [1300, 650] },
  { file: 'IMG_6500.jpeg', name: 'huracan-02',   widths: [1300, 650] },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  for (const job of JOBS) {
    const src = path.join(SRC, job.file);
    if (!fs.existsSync(src)) {
      console.error('missing source: ' + src);
      process.exitCode = 1;
      continue;
    }

    const meta = await sharp(src).rotate().metadata();
    const width = meta.width;
    const height = Math.round(width * 3 / 4);
    const top = Math.round((meta.height - height) * CROP_FRAC);

    for (const w of job.widths) {
      const base = sharp(src).rotate()
        .extract({ left: 0, top, width, height })
        .resize(w);

      await base.clone().webp({ quality: 80 })
        .toFile(path.join(OUT, `${job.name}-${w}.webp`));

      // JPEG fallback only at the largest width; <picture> falls back wholesale
      if (w === job.widths[0]) {
        await base.clone().jpeg({ quality: 82, mozjpeg: true })
          .toFile(path.join(OUT, `${job.name}-${w}.jpg`));
      }
    }

    console.log(`${job.file} -> ${job.name}  (crop ${width}x${height} @ top ${top})`);
  }
})();
