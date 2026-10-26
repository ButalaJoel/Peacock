// Stage 3: move the page components out of PeacockPaintsWebsite.jsx into src/pages/.
// Run from the project root:  node split-stage3.mjs
//
// Creates:  src/pages/PaintCategoryPage.jsx, ProductDetailPage.jsx, RoomInspirationPage.jsx,
//           ColourCategoryPage.jsx, StyleCategoryPage.jsx, ColourDetailPage.jsx
// Then removes those blocks from the main file and imports them instead.
// Each new file is checked for syntax BEFORE anything is written.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const SRC = "src/PeacockPaintsWebsite.jsx";
if (!fs.existsSync(SRC)) { console.error(`Cannot find ${SRC}. Run this from the project root.`); process.exit(1); }
if (!fs.existsSync("src/data/images.js")) { console.error("src/data/images.js is missing - run stages 1 and 2 first."); process.exit(1); }

const original = fs.readFileSync(SRC, "utf8").replace(/\r\n/g, "\n");
if (original.includes('./pages/')) { console.error("Stage 3 looks like it was already done (the file already imports from ./pages/)."); process.exit(1); }
const lines = original.split("\n");
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

// names that can be imported, and where from (paths are relative to src/pages/)
const imageNames = [...fs.readFileSync("src/data/images.js", "utf8").matchAll(/^import (\w+) from/gm)].map(m => m[1]);
const sources = [
  { path: "../data/images.js", names: imageNames },
  { path: "../data/theme.js", names: ["B"] },
  { path: "../data/products.js", names: ["PRODUCTS", "SAMPLE_POT", "SAMPLE_BUNDLE"] },
  { path: "../data/storyPages.js", names: ["storyPages"] },
  { path: "../data/navData.js", names: ["navData"] },
  { path: "../data/colours.js", names: ["trendingColours", "CAT_SWATCH_COLORS", "COLOUR_CATEGORIES", "STYLE_CATEGORIES", "COLOUR_DETAILS"] },
  { path: "../data/inspirations.js", names: ["BEDROOM_INSPIRATIONS", "LIVING_ROOM_INSPIRATIONS", "DINING_ROOM_INSPIRATIONS", "KITCHEN_INSPIRATIONS", "BATHROOM_INSPIRATIONS", "ROOM_META"] },
  { path: "../components/icons/Icons.jsx", names: ["CartIcon","SearchIcon","UserIcon","ChevDown","ChevRight","MenuIcon","CloseIcon","Arr","ArrL","PhoneIcon","MailIcon","TruckIcon","PaletteIcon","HeartIcon","GlobeIcon","UsersIcon","LeafIcon","MinusIcon","PlusIcon","CheckIcon","StarIcon"] },
];
const hooks = ["useState", "useEffect", "useRef"];
const uses = (text, n) => new RegExp(`\\b${n}\\b`).test(text);

const pages = [
  "PaintCategoryPage", "ProductDetailPage", "RoomInspirationPage",
  "ColourCategoryPage", "StyleCategoryPage", "ColourDetailPage",
];

const esbuildRef = (() => {
  try { return createRequire(path.resolve("package.json"))("esbuild"); } catch { return null; }
})();
const check = (code, label) => {
  if (!esbuildRef) return;
  try { esbuildRef.transformSync(code, { loader: "jsx" }); }
  catch (e) { problems.push(`${label} would have a syntax error: ${String(e.message).split("\n")[0]}`); }
};

const outputs = {};
const removals = [];
for (const name of pages) {
  const b = findBlock(name);
  if (!b) continue;
  removals.push(b);
  let extra = "";
  if (name === "ColourDetailPage") {
    const pr = findBlock("PAINT_RECOMMENDATIONS");
    if (pr) { removals.push(pr); extra = pr.text.replace(/\s*\/\/.*$/, "") + "\n\n"; }
  }
  const body = extra + b.text + `\n\nexport default ${name};\n`;
  const imp = [];
  const usedHooks = hooks.filter(h => uses(body, h));
  if (usedHooks.length) imp.push(`import { ${usedHooks.join(", ")} } from "react";`);
  for (const s of sources) {
    const used = s.names.filter(n => uses(body, n));
    if (used.length) imp.push(`import { ${used.join(", ")} } from "${s.path}";`);
  }
  if (uses(body, "PaintBlob")) imp.push(`import PaintBlob from "../components/common/PaintBlob.jsx";`);
  const code = imp.join("\n") + (imp.length ? "\n\n" : "") + body;
  check(code, `src/pages/${name}.jsx`);
  outputs[`src/pages/${name}.jsx`] = code;
}

// ---- rewrite the main file ----
const kill = new Set();
for (const b of removals) for (let i = b.start; i < b.end; i++) kill.add(i);
let kept = lines.filter((_, i) => !kill.has(i)).join("\n");
kept = kept.replace(/^\/\/ ═══════ (?:PAINT CATEGORY PAGE|PRODUCT DETAIL PAGE|ROOM INSPIRATION PAGE.*|COLOUR CATEGORY PAGE|STYLE CATEGORY PAGE|COLOUR DETAIL PAGE) ═══════\n/gm, "");

// drop imports (from our modules) that the main file no longer uses
const keptLines = kept.split("\n");
const bodyText = keptLines.filter(l => !l.startsWith("import ")).join("\n");
const rebuilt = [];
for (const l of keptLines) {
  const m = l.match(/^import \{ (.+) \} from "(\.\/(?:data|components)\/[^"]+)";$/);
  if (m) {
    const names = m[1].split(",").map(s => s.trim()).filter(n => uses(bodyText, n));
    if (names.length) rebuilt.push(`import { ${names.join(", ")} } from "${m[2]}";`);
    continue;
  }
  const d = l.match(/^import (\w+) from "(\.\/components\/[^"]+)";$/);
  if (d) { if (uses(bodyText, d[1])) rebuilt.push(l); continue; }
  rebuilt.push(l);
}
// add the page imports after the css import
const pageImports = pages.map(n => `import ${n} from "./pages/${n}.jsx";`);
const cssIdx = rebuilt.findIndex(l => l.startsWith('import "./styles/global.css"'));
if (cssIdx < 0) problems.push('Could not find the line: import "./styles/global.css";');
rebuilt.splice(cssIdx + 1, 0, ...pageImports);
const result = rebuilt.join("\n").replace(/\n{3,}/g, "\n\n");
check(result, SRC);

if (problems.length) {
  console.error("\nStopped. Nothing was changed because of these problems:\n");
  problems.forEach(p => console.error("  - " + p));
  console.error("\nCopy this message and send it to Claude.");
  process.exit(1);
}

fs.mkdirSync("src/pages", { recursive: true });
for (const [f, c] of Object.entries(outputs)) fs.writeFileSync(f, c, "utf8");
fs.writeFileSync(SRC, result, "utf8");

if (!esbuildRef) console.log("(esbuild not found - skipped syntax check)");
console.log("\nCreated:");
for (const [f, c] of Object.entries(outputs)) console.log(`  ${f.padEnd(38)} ${String(c.split("\n").length - 1).padStart(4)} lines`);
console.log(`\nPeacockPaintsWebsite.jsx: ${lines.length} lines -> ${result.split("\n").length} lines`);
console.log("\nNext: run  npm run dev  and click through the site (a colour, a product, a room, a style).");
console.log("If anything is wrong, undo with:  git checkout . ; git clean -fd src/pages");
