// fix-logo-trim.mjs   Run from the project root:   node fix-logo-trim.mjs
// The new logo file has empty transparent space around the artwork, so the logo shows small even though its box is big.
// This crops that empty space (keeps a small margin) so the logo fills its box. The uncropped file is kept in originals-backup/logos.
// Undo: copy originals-backup/logos/header-before-trim.png back over src/assets/logos/header.png
import fs from "node:fs";
import path from "node:path";

const F = "src/assets/logos/header.png";
if (!fs.existsSync(F)) { console.log("Missing " + F + ". Run fix-logo.mjs first."); process.exit(1); }
if (fs.existsSync("originals-backup/logos/header-before-trim.png")) { console.log("Already done (a backup exists). Nothing changed."); process.exit(1); }

let sharp;
try { sharp = (await import("sharp")).default; } catch { console.log("sharp is not installed. Run:  npm install --save-dev sharp   then try again."); process.exit(1); }

const before = await sharp(F).metadata();
const trimmed = await sharp(F).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
const w = trimmed.info.width, h = trimmed.info.height;
console.log("before: " + before.width + " x " + before.height + "   after crop: " + w + " x " + h);
if (w >= before.width * 0.95 && h >= before.height * 0.95) {
  console.log("The logo file has no empty space to crop, so the size is not the problem. Nothing changed. Tell me, and I will make the logo box bigger instead.");
  process.exit(0);
}
const pad = Math.max(4, Math.round(Math.max(w, h) * 0.02));
const out = await sharp(trimmed.data).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }).toBuffer();

fs.mkdirSync("originals-backup/logos", { recursive: true });
fs.copyFileSync(F, "originals-backup/logos/header-before-trim.png");
fs.writeFileSync(F, out);
console.log("Done. Logo cropped to " + (w + 2 * pad) + " x " + (h + 2 * pad) + " (" + Math.round(out.length / 1024) + " KB). Refresh the page to see it.");
