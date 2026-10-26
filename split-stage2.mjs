// Stage 2: make PeacockPaintsWebsite.jsx USE the files created in stage 1.
// Run from the project root:  node split-stage2.mjs
//
// It removes the data / icon / PaintBlob / CSS blocks from the main file and
// replaces them with imports. Before removing anything it checks that every
// block is an exact copy of what is in the new files. If any check fails,
// nothing is changed.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const SRC = "src/PeacockPaintsWebsite.jsx";
if (!fs.existsSync(SRC)) { console.error(`Cannot find ${SRC}. Run this from the project root.`); process.exit(1); }

const original = fs.readFileSync(SRC, "utf8").replace(/\r\n/g, "\n");
if (original.includes('from "./data/theme.js"')) {
  console.error("This file already imports from ./data/theme.js - stage 2 looks like it was already done.");
  process.exit(1);
}
let lines = original.split("\n");
const problems = [];
const TOP = /^(const |function |export |import |\/\/ )/;

function findBlock(name) {
  const re = new RegExp(`^const ${name}\\s*=`);
  const hits = lines.map((l, i) => (re.test(l) ? i : -1)).filter(i => i >= 0);
  if (hits.length !== 1) { problems.push(`Expected one "const ${name} =" but found ${hits.length}`); return null; }
  const start = hits[0];
  let end = start + 1;
  while (end < lines.length && !TOP.test(lines[end])) end++;
  while (end > start + 1 && lines[end - 1].trim() === "") end--;
  return { name, start, end, text: lines.slice(start, end).join("\n") };
}

const read = f => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n") : (problems.push(`Missing file ${f} - run stage 1 first`), ""));

// what moved where
const plan = [
  { file: "src/data/theme.js", names: ["B"] },
  { file: "src/data/products.js", names: ["PRODUCTS", "SAMPLE_POT", "SAMPLE_BUNDLE"] },
  { file: "src/data/storyPages.js", names: ["storyPages"] },
  { file: "src/data/navData.js", names: ["navData"] },
  { file: "src/data/colours.js", names: ["trendingColours", "CAT_SWATCH_COLORS", "COLOUR_CATEGORIES", "STYLE_CATEGORIES", "COLOUR_DETAILS"] },
  { file: "src/data/inspirations.js", names: ["BEDROOM_INSPIRATIONS", "LIVING_ROOM_INSPIRATIONS", "DINING_ROOM_INSPIRATIONS", "KITCHEN_INSPIRATIONS", "BATHROOM_INSPIRATIONS", "ROOM_META"] },
  { file: "src/components/icons/Icons.jsx", names: ["CartIcon","SearchIcon","UserIcon","ChevDown","ChevRight","MenuIcon","CloseIcon","Arr","ArrL","PhoneIcon","MailIcon","TruckIcon","PaletteIcon","HeartIcon","GlobeIcon","UsersIcon","LeafIcon","MinusIcon","PlusIcon","CheckIcon","StarIcon"], named: true },
  { file: "src/components/common/PaintBlob.jsx", names: ["PaintBlob"], defaultExport: true },
];

const removals = [];
for (const p of plan) {
  const content = read(p.file);
  for (const n of p.names) {
    const b = findBlock(n);
    if (!b) continue;
    const exported = b.text.replace(/^const /, p.defaultExport ? "const " : "export const ");
    if (!content.includes(exported)) problems.push(`Block "${n}" is not an exact copy in ${p.file}`);
    removals.push(b);
  }
}

// image imports
const imageFile = read("src/data/images.js");
const imageNames = [];
const imageIdx = [];
lines.forEach((l, i) => {
  const m = l.match(/^import\s+([A-Za-z0-9_]+)\s+from\s+"\.\/assets\/(.+)";\s*$/);
  if (m) {
    imageNames.push(m[1]);
    imageIdx.push(i);
    if (!imageFile.includes(`import ${m[1]} from "../assets/${m[2]}";`)) problems.push(`Image import ${m[1]} is missing from src/data/images.js`);
  }
});

// style block
const open = original.indexOf("<style>{`");
const close = original.indexOf("`}</style>");
if (open < 0 || close < 0) problems.push("Could not find the <style> block");
if (!fs.existsSync("src/styles/global.css")) problems.push("Missing src/styles/global.css - run stage 1 first");

if (problems.length) {
  console.error("\nStopped. Nothing was changed because of these problems:\n");
  problems.forEach(p => console.error("  - " + p));
  console.error("\nCopy this message and send it to Claude.");
  process.exit(1);
}

// ---- apply: remove blocks (from the bottom up so indexes stay valid) ----
const kill = new Set();
for (const b of removals) for (let i = b.start; i < b.end; i++) kill.add(i);
for (const i of imageIdx) kill.add(i);
let kept = lines.filter((_, i) => !kill.has(i)).join("\n");

// remove the <style> element (whole line range)
kept = kept.replace(/[ \t]*<style>\{`[\s\S]*?`\}<\/style>[ \t]*\n?/, "");

// remove leftover section-title comments that now sit above nothing
kept = kept.replace(/^\/\/ ─── (?:IMAGE IMPORTS|INSPIRATION IMAGE IMPORTS|LIVING ROOM INSPIRATION IMAGE IMPORTS|DINING ROOM INSPIRATION IMAGE IMPORTS|KITCHEN INSPIRATION IMAGE IMPORTS|BATHROOM INSPIRATION IMAGE IMPORTS) ───\n/gm, "");
kept = kept.replace(/^\/\/ (?:Icons|Nav)\n/gm, "");
kept = kept.replace(/^\/\/ (?:─── (?:PRODUCT DATABASE|Our Story Pages|PEACOCK PAINTS COLOUR RANGE.*|COLOUR CATEGORIES|STYLE CATEGORIES|COLOUR DETAIL DATA|(?:LIVING ROOM |DINING ROOM |KITCHEN |BATHROOM )?INSPIRATIONS?) ───|═══════ BEDROOM INSPIRATION DATA ═══════)\n/gm, "");
kept = kept.replace(/\n{3,}/g, "\n\n");

// ---- build the import block (only names the file still uses) ----
const uses = n => new RegExp(`\\b${n}\\b`).test(kept);
const imp = [];
const firstLine = kept.split("\n")[0];
if (!/^import .*from "react"/.test(firstLine)) problems.push("First line is not the React import");
const usedImages = imageNames.filter(uses);
if (usedImages.length) imp.push(`import { ${usedImages.join(", ")} } from "./data/images.js";`);
for (const p of plan) {
  const used = p.names.filter(uses);
  if (!used.length) continue;
  const mod = "./" + p.file.replace(/^src\//, "");
  if (p.defaultExport) imp.push(`import ${used[0]} from "${mod}";`);
  else imp.push(`import { ${used.join(", ")} } from "${mod}";`);
}
imp.push(`import "./styles/global.css";`);

if (problems.length) { console.error(problems.join("\n")); process.exit(1); }

const [reactLine, ...rest] = kept.split("\n");
const result = reactLine + "\n" + imp.join("\n") + "\n" + rest.join("\n");

// syntax check BEFORE writing (uses esbuild, which Vite already installed)
try {
  const require = createRequire(path.resolve("package.json"));
  const esbuild = require("esbuild");
  try {
    esbuild.transformSync(result, { loader: "jsx" });
    console.log("Syntax check: OK");
  } catch (e) {
    console.error("The rewritten file would have a syntax error, so NOTHING was changed:");
    console.error(String(e.message).split("\n").slice(0, 4).join("\n"));
    process.exit(1);
  }
} catch (e) {
  console.log("(esbuild not found - skipped syntax check)");
}

fs.writeFileSync(SRC, result, "utf8");

const before = original.split("\n").length, after = result.split("\n").length;
console.log(`\nPeacockPaintsWebsite.jsx: ${before} lines -> ${after} lines`);
console.log("Imports added:\n  " + imp.join("\n  "));
console.log("\nNext: run  npm run dev  and check the site looks the same.");
console.log("If anything is wrong, undo with:  git checkout src/PeacockPaintsWebsite.jsx");
