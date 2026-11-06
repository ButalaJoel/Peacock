// Shrinks the big images so the site loads fast on phones. Originals are kept in  originals-backup\  (not committed).
//  - src/assets/hero        : photos are resized to 1600px wide and saved as .jpg
//  - public/products, src/assets/products, src/assets/kits : mockups are resized (max 1400px) and re-saved as PNG, same file names
// Only files bigger than 250 KB are touched. Safe to run twice.
// First time only:  npm install --save-dev sharp      then:  node compress-images.mjs
import fs from "node:fs";
import path from "node:path";

let sharp;
try { sharp = (await import("sharp")).default; } catch { console.log("\nsharp is not installed. Run this first, then run the script again:\n  npm install --save-dev sharp\n"); process.exit(1); }

const MIN = 250 * 1024, BACKUP = "originals-backup";
const walk = d => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
const mb = n => (n / 1048576).toFixed(1) + " MB";
const backup = f => { const t = path.join(BACKUP, f); fs.mkdirSync(path.dirname(t), { recursive: true }); if (!fs.existsSync(t)) fs.copyFileSync(f, t); };

let before = 0, after = 0, changed = 0;
const jobs = [];
for (const f of walk(path.join("src", "assets", "hero"))) if (/\.(png|jpe?g|webp)$/i.test(f)) jobs.push({ f, kind: "photo" });
for (const d of [path.join("public", "products"), path.join("src", "assets", "products"), path.join("src", "assets", "kits")])
  for (const f of walk(d)) if (/\.png$/i.test(f)) jobs.push({ f, kind: "mockup" });

for (const { f, kind } of jobs) {
  const size = fs.statSync(f).size;
  if (size < MIN) continue;
  try {
    if (kind === "photo") {
      const out = f.replace(/\.[a-z]+$/i, ".jpg");
      const buf = await sharp(f).rotate().resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
      if (buf.length > size * 0.9) continue;
      backup(f); fs.writeFileSync(out + ".tmp", buf);
      if (out !== f) fs.unlinkSync(f);
      fs.renameSync(out + ".tmp", out);
      before += size; after += buf.length; changed++;
      console.log("  " + f + " : " + mb(size) + " -> " + mb(buf.length));
    } else {
      const buf = await sharp(f).resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true }).png({ palette: true, quality: 90, effort: 8 }).toBuffer();
      if (buf.length > size * 0.9) continue;
      backup(f); fs.writeFileSync(f, buf);
      before += size; after += buf.length; changed++;
      console.log("  " + f + " : " + mb(size) + " -> " + mb(buf.length));
    }
  } catch (e) { console.log("  skipped " + f + " (" + String(e.message).split("\n")[0] + ")"); }
}
if (fs.existsSync(".gitignore") && !fs.readFileSync(".gitignore", "utf8").includes(BACKUP)) fs.appendFileSync(".gitignore", "\n" + BACKUP + "/\n");
else if (!fs.existsSync(".gitignore")) fs.writeFileSync(".gitignore", BACKUP + "/\n");
console.log("\n" + changed + " images shrunk: " + mb(before) + " -> " + mb(after) + ". Originals are in the " + BACKUP + " folder (not committed).\nNext: refresh the site and check the pictures still look sharp.");
