/* One-off: trim transparent padding from brand logo PNGs so the visible
   logo fills its canvas. Run: node scripts/trim-brand-logos.mjs */
import sharp from "sharp";
import { readdir, rename } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("public/images/brands");
const files = (await readdir(dir)).filter((f) => f.endsWith(".png"));

for (const file of files) {
  const src = path.join(dir, file);
  const tmp = path.join(dir, file + ".tmp");
  const before = await sharp(src).metadata();
  await sharp(src).trim().png().toFile(tmp);
  const after = await sharp(tmp).metadata();
  await rename(tmp, src);
  console.log(
    `${file}: ${before.width}x${before.height} -> ${after.width}x${after.height}`
  );
}
