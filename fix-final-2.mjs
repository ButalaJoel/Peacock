// fix-final-2.mjs  (run AFTER fix-final.mjs and add-visualiser.mjs, from the project root:  node fix-final-2.mjs)
//   1. Product page "Select Colour & Size": the colour FAMILY cards (Creams, Neutrals, Pinks...) get the glossy paint blob
//   2. Product page shade cards: the old flat blob is replaced by the same glossy blob used everywhere else
//   3. The "+ Sample" / "Sample" buttons on the home colours and the Shop all colours page open the new sample prompt
//   4. Delivery wording: "We deliver."
// Every edit must match exactly once, otherwise NOTHING is changed.   Undo: git checkout . ; git clean -fd src

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const problems = [];
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const files = {};
const load = f => { if (!fs.existsSync(f)) { problems.push("Missing " + f); return false; } files[f] = read(f); return true; };

// regex edit that must match exactly once
const once = (f, re, rep, label) => {
  if (files[f] === undefined) return;
  const n = (files[f].match(new RegExp(re.source, "g")) || []).length;
  if (n !== 1) { problems.push(f + ": expected 1 match, found " + n + " for " + label); return; }
  files[f] = files[f].replace(re, rep);
};

const PD = "src/pages/ProductDetailPage.jsx";
if (load(PD)) {
  if (files[PD].includes("cat.repColor + \" 14%")) problems.push("This looks already applied");
  once(PD,
    /(<div\s+onClick=\{\(\) => setSelectedCategory\(isSelected \? null : catName\)\}\s+)style=\{\{ height: 100, background: cat\.repColor, (borderRadius: 12, border: isSelected \? "2px solid #1a1a1a" : "2px solid transparent", cursor: "pointer", transition: "all 0\.2s", marginBottom: 10) \}\}\s*\/>/,
    (m, a, b) => a + 'style={{ height: 100, background: "color-mix(in srgb, " + cat.repColor + " 14%, #fff)", display: "grid", placeItems: "center", ' + b + ' }}><PaintBlob size={84} color={cat.repColor} v={catName.length} /></div>',
    "the colour family cards");
  once(PD,
    /<div style=\{\{ width: 130, height: 130, background: col\.color, borderRadius: "52% 48% 56% 44% \/ 48% 52% 48% 52%", boxShadow: `[^`]*` \}\} \/>/,
    () => "<PaintBlob size={130} color={col.color} v={col.name.length} />",
    "the shade blob");
}

// sample buttons
for (const f of ["src/components/home/TrendingColours.jsx", "src/pages/AllColoursPage.jsx"]) {
  if (!load(f)) continue;
  if (files[f].includes("askForSample")) { problems.push(f + ": already applied"); continue; }
  once(f, /addSamplePot\(([^()]*)\)/, (m, arg) => "askForSample(" + arg + ")", "the sample button in " + f);
  once(f, /,\s*addSamplePot(?=\s*\} = useApp\(\))/, () => "", "the unused addSamplePot name in " + f);
  let rel = path.relative(path.dirname(f), "src/utils/sampleDialog.js").replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  files[f] = 'import { askForSample } from "' + rel + '";\n' + files[f];
}
if (!fs.existsSync("src/utils/sampleDialog.js")) problems.push("Run fix-final.mjs first (src/utils/sampleDialog.js is missing)");

// delivery wording
if (load("src/config/business.js")) once("src/config/business.js", /delivery: "Delivery available\.",/, () => 'delivery: "We deliver.",', "the delivery line");

if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }

const require = createRequire(path.resolve("package.json"));
let esbuild;
try { esbuild = require("esbuild"); } catch { problems.push("esbuild not found: run npm install first"); }
if (esbuild) for (const [f, c] of Object.entries(files)) {
  try { esbuild.transformSync(c, { loader: f.endsWith(".jsx") ? "jsx" : "js" }); }
  catch (e) { problems.push("Syntax problem in " + f + ": " + String(e.message).split("\n")[0]); }
}
if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }

for (const [f, c] of Object.entries(files)) fs.writeFileSync(f, c);
console.log("\nDone. Files changed:");
Object.keys(files).forEach(f => console.log("  " + f));
console.log("\nNext: npx eslint src, then npm run dev. Check a product page with colours (family cards and shade cards), the home colours and Shop all colours sample buttons.");
console.log("Undo anytime with:  git checkout . ; git clean -fd src");
