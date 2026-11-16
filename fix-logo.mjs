// fix-logo.mjs   Run from the project root:   node fix-logo.mjs
//   * Uses the new logo from your Downloads folder ("PEACOCK UPDATED LOGO-01"). Another file can be given:  node fix-logo.mjs "C:\path\logo.png"
//   * Replaces the nav / mobile menu logo with it (src/data/images.js, LOGO_HEADER). The old one is not deleted.
//   * Removes the white glow behind the logo, and keeps "Our Story" and "Get a quote" on ONE line (a little more room for the menu).
// Nothing is written if something does not match.   Undo: git checkout . ; git clean -fd src

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const problems = [], notes = [];
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");

// 1. find the logo file
let srcLogo = process.argv[2];
if (!srcLogo) {
  const dl = path.join(os.homedir(), "Downloads");
  const hits = fs.existsSync(dl) ? fs.readdirSync(dl).filter(n => /^peacock updated logo/i.test(n) && /\.(png|svg|webp|jpe?g)$/i.test(n)) : [];
  if (!hits.length) problems.push('No file named "PEACOCK UPDATED LOGO..." (png, svg, webp or jpg) in ' + dl + '. Run again with the full path:  node fix-logo.mjs "C:\\Users\\HP\\Downloads\\yourfile.png"');
  else srcLogo = path.join(dl, hits.map(n => ({ n, t: fs.statSync(path.join(dl, n)).mtimeMs })).sort((a, b) => b.t - a.t)[0].n);
}
if (srcLogo && !fs.existsSync(srcLogo)) problems.push("Cannot find " + srcLogo);
const ext = srcLogo ? path.extname(srcLogo).toLowerCase().replace("jpeg", "jpg") : "";
if (/\.jpg$/.test(ext)) notes.push("This logo is a JPG, so it has a solid background. A PNG with a transparent background looks better.");

// 2. images.js: LOGO_HEADER is imported from a file (src/assets/logos/header.png). We replace that file and keep a backup.
const IMG = "src/data/images.js";
let imgText = "", destLogo = "", oldLogo = "";
if (!fs.existsSync(IMG)) problems.push("Missing " + IMG);
else {
  imgText = read(IMG);
  const re = /import LOGO_HEADER from "([^"]+)";/;
  const m = imgText.match(re);
  if (!m) problems.push(IMG + ': no line like  import LOGO_HEADER from "...";  (send me the LOGO lines)');
  else {
    oldLogo = path.join("src/data", m[1]).replace(/\\/g, "/");
    if (/\.(png|svg|webp|jpg)$/i.test(oldLogo) && path.extname(oldLogo).toLowerCase() === ext) destLogo = oldLogo;
    else {
      destLogo = oldLogo.replace(/\.[a-z]+$/i, "") + ext;
      imgText = imgText.replace(re, () => 'import LOGO_HEADER from "' + m[1].replace(/\.[a-z]+$/i, "") + ext + '";');
    }
    if (!fs.existsSync(oldLogo)) notes.push("The old logo file " + oldLogo + " was not found, so no backup was made.");
    if (fs.existsSync("originals-backup/logos/header-before-update" + path.extname(oldLogo))) problems.push("This looks already applied (a backup of the old logo exists)");
  }
}

// 3. CSS
const CSS = "src/styles/global.css";
const MARK = "/* logo-fix (fix-logo.mjs) */";
const CSS_ADD = `
${MARK}
.pill-bar button, .pill-bar a, .pill-item { white-space: nowrap; }
@media (min-width: 769px) {
  .pill-header { max-width: 1400px; }
  .pill-bar { margin-left: 172px; }
  .pill-logo { left: -172px; width: 160px; }
  .pill-logo img { filter: none; max-width: 160px; height: auto; max-height: 92px; }
  .pill-item { padding: 9px 11px; }
}
@media (min-width: 769px) and (max-width: 1280px) {
  .pill-item { padding: 8px 8px; font-size: 12.5px; letter-spacing: .2px; }
  .pill-actions { gap: 2px; }
}
@media (min-width: 769px) and (max-width: 1100px) {
  .pill-bar { margin-left: 140px; }
  .pill-logo { left: -140px; width: 128px; }
  .pill-logo img { max-width: 128px; max-height: 68px; }
}
`;
if (!fs.existsSync(CSS)) problems.push("Missing " + CSS);
else if (read(CSS).includes(MARK)) problems.push("This looks already applied (CSS)");

if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }

// syntax check images.js
const require = createRequire(path.resolve("package.json"));
try { require("esbuild").transformSync(imgText, { loader: "js" }); }
catch (e) { console.log("\nNothing was changed. Syntax problem in " + IMG + ": " + String(e.message).split("\n")[0]); process.exit(1); }

// write
fs.mkdirSync(path.dirname(destLogo), { recursive: true });
if (fs.existsSync(oldLogo)) {
  fs.mkdirSync("originals-backup/logos", { recursive: true });
  fs.copyFileSync(oldLogo, "originals-backup/logos/header-before-update" + path.extname(oldLogo));
}
let done = false;
if (ext === ".png") {
  try { const sharp = (await import("sharp")).default; const buf = await sharp(srcLogo).resize({ width: 800, withoutEnlargement: true }).png({ compressionLevel: 9 }).toBuffer(); fs.writeFileSync(destLogo, buf); done = true; } catch { /* fall back to a plain copy */ }
}
if (!done) fs.copyFileSync(srcLogo, destLogo);
if (imgText !== read(IMG)) fs.writeFileSync(IMG, imgText);
fs.appendFileSync(CSS, CSS_ADD);

console.log("\nDone.\n  new logo saved as " + destLogo + " (" + Math.round(fs.statSync(destLogo).size / 1024) + " KB). The old one is kept in originals-backup/logos\n  " + CSS + " updated");
notes.forEach(n => console.log("Note: " + n));
console.log("\nThe footer logo (src/assets/logos/footer.png) was left alone, since the footer is dark. If it needs the new logo too, tell me how the footer looks.");
console.log("Next: npm run dev and look at the nav bar at full width and at a narrower window. Undo with:  git checkout . ; git clean -fd src   (the old logo is also in originals-backup/logos)");
