/**
 * scripts/clean-logos.mjs
 * Removes backgrounds and tightly crops Hasiba and Zetawala logos,
 * creating crisp, transparent PNG assets.
 */

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const IMAGES_DIR = path.resolve(process.cwd(), 'public/images');

async function processHasibaLogo() {
  const inputPath = path.join(IMAGES_DIR, 'hasiba-logo.png');
  const backupPath = path.join(IMAGES_DIR, 'hasiba-logo-original.png');
  
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
    console.log('✓ Backed up original Hasiba logo.');
  }

  const { data, info } = await sharp(backupPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outBuffer = Buffer.alloc(width * height * 4);

  // Background is around [246, 246, 244]
  // Color distance threshold
  const bgR = 246, bgG = 246, bgB = 244;

  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * channels;
      const dstIdx = (y * width + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      const dist = Math.sqrt(
        (r - bgR) ** 2 +
        (g - bgG) ** 2 +
        (b - bgB) ** 2
      );

      // Smooth alpha ramp
      // dist < 12: pure background (alpha 0)
      // dist > 28: pure foreground (alpha 255)
      // in between: anti-aliased edge
      let alpha = 255;
      if (dist < 12) {
        alpha = 0;
      } else if (dist < 28) {
        alpha = Math.round(((dist - 12) / 16) * 255);
      }

      if (alpha > 20) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }

      outBuffer[dstIdx] = r;
      outBuffer[dstIdx + 1] = g;
      outBuffer[dstIdx + 2] = b;
      outBuffer[dstIdx + 3] = alpha;
    }
  }

  // Add 20px padding around bounding box
  const pad = 24;
  const cropLeft = Math.max(0, minX - pad);
  const cropTop = Math.max(0, minY - pad);
  const cropWidth = Math.min(width - cropLeft, maxX - minX + pad * 2);
  const cropHeight = Math.min(height - cropTop, maxY - minY + pad * 2);

  // Save clean transparent cropped PNG
  await sharp(outBuffer, { raw: { width, height, channels: 4 } })
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .resize(600, 600, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(inputPath);

  console.log(`✓ Processed hasiba-logo.png: transparent background, cropped from 2048x2048 to ${cropWidth}x${cropHeight}, saved as 600x600 high-res PNG.`);
}

async function processZetawalaLogo() {
  const inputPath = path.join(IMAGES_DIR, 'zetawala-logo.png');
  const backupPath = path.join(IMAGES_DIR, 'zetawala-logo-original.png');

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
    console.log('✓ Backed up original Zetawala logo.');
  }

  const { data, info } = await sharp(backupPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outBuffer = Buffer.alloc(width * height * 4);

  // Background is dark navy [1, 4, 22]
  const bgR = 1, bgG = 4, bgB = 22;

  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * channels;
      const dstIdx = (y * width + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      const dist = Math.sqrt(
        (r - bgR) ** 2 +
        (g - bgG) ** 2 +
        (b - bgB) ** 2
      );

      let alpha = 255;
      if (dist < 18) {
        alpha = 0;
      } else if (dist < 36) {
        alpha = Math.round(((dist - 18) / 18) * 255);
      }

      if (alpha > 20) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }

      outBuffer[dstIdx] = r;
      outBuffer[dstIdx + 1] = g;
      outBuffer[dstIdx + 2] = b;
      outBuffer[dstIdx + 3] = alpha;
    }
  }

  const pad = 16;
  const cropLeft = Math.max(0, minX - pad);
  const cropTop = Math.max(0, minY - pad);
  const cropWidth = Math.min(width - cropLeft, maxX - minX + pad * 2);
  const cropHeight = Math.min(height - cropTop, maxY - minY + pad * 2);

  await sharp(outBuffer, { raw: { width, height, channels: 4 } })
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(inputPath);

  console.log(`✓ Processed zetawala-logo.png: transparent background, cropped to ${cropWidth}x${cropHeight} PNG.`);
}

async function main() {
  await processHasibaLogo();
  await processZetawalaLogo();
}

main().catch(err => {
  console.error('Error cleaning logos:', err);
  process.exit(1);
});
