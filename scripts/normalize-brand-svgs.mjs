/* One-off: copy the official brand SVGs from public/brands (source, as
   downloaded) into public/images/brands with clean slug names, rewriting
   each viewBox to the visible content bounds so padding baked into the
   canvas doesn't shrink the rendered logo.
   Run: node scripts/normalize-brand-svgs.mjs */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("public/brands");
const DST = path.resolve("public/images/brands");
const RENDER_W = 1024;

/* source filename -> slug used by the component */
const FILES = {
  "mercedes-benz-9.svg": "mercedes-benz",
  "bmw-7 (1).svg": "bmw",
  "lexus-division-emblem.svg": "lexus",
  "toyota-logo.svg": "toyota",
  "nissan-6.svg": "nissan",
  "porsche-4.svg": "porsche",
  "land-roverin-logo.svg": "land-rover",
  "audi-16.svg": "audi",
};

for (const [file, slug] of Object.entries(FILES)) {
  const raw = await readFile(path.join(SRC, file), "utf8");
  const vbMatch = raw.match(/viewBox="([^"]+)"/);
  if (!vbMatch) throw new Error(`${file}: no viewBox`);
  const [minX, minY, vbW, vbH] = vbMatch[1].trim().split(/[\s,]+/).map(Number);

  // Strip width/height BEFORE rasterizing — if their aspect ratio differs
  // from the viewBox, the render and the viewBox math won't line up.
  const svg = raw.replace(/<svg[^>]*>/, (tag) =>
    tag.replace(/\s(width|height)="[^"]*"/g, "")
  );

  // Rasterize, trim transparent borders, and map pixel bounds -> viewBox units
  const { info } = await sharp(Buffer.from(svg))
    .resize({ width: RENDER_W })
    .png()
    .toBuffer({ resolveWithObject: true })
    .then(({ data }) => sharp(data).trim().toBuffer({ resolveWithObject: true }));

  const scale = RENDER_W / vbW;
  const newX = minX + -info.trimOffsetLeft / scale;
  const newY = minY + -info.trimOffsetTop / scale;
  const newW = info.width / scale;
  const newH = info.height / scale;
  const newVb = [newX, newY, newW, newH].map((n) => n.toFixed(3)).join(" ");

  // Rewrite viewBox (width/height already stripped so CSS controls the size)
  const out = svg.replace(/viewBox="[^"]+"/, `viewBox="${newVb}"`);

  await writeFile(path.join(DST, `${slug}.svg`), out);
  console.log(`${file} -> ${slug}.svg | viewBox ${vbMatch[1]} -> ${newVb}`);
}
