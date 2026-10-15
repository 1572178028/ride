// Offline alternative to the Python/Chromium exporter. Requires the sharp package.
// NODE_PATH can point at an existing runtime package directory; no site dependency.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
(async () => {
  for (const name of (await fs.readdir(path.join(root, 'maps'))).filter(n => n.endsWith('.svg'))) {
    await sharp(await fs.readFile(path.join(root, 'maps', name)), { density: 144 })
      .png().toFile(path.join(root, 'maps', name.replace(/\.svg$/, '.png')));
    process.stdout.write(name.replace(/\.svg$/, '.png') + '\n');
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
