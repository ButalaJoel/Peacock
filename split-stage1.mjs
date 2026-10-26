// Stage 1 of splitting PeacockPaintsWebsite.jsx into modules.
// Run from the project root:  node split-stage1.mjs
//
// It READS src/PeacockPaintsWebsite.jsx and CREATES new files only.
// The original file is NOT modified, so the site keeps working after this step.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const SRC = "src/PeacockPaintsWebsite.jsx";
if (!fs.existsSync(SRC)) {
  console.error(`Cannot find ${SRC}. Run this from the project root (the folder with package.json).`);
  process.exit(1);
}

const text = fs.readFileSync(SRC, "utf8").replace(/\r\n/g, "\n");
const lines = text.split("\n");
const problems = [];

// A new top-level statement or section comment starts at column 0 with one of these.
const TOP = /^(const |function |export |import |\/\/ )/;

function getBlock(name) {
  const re = new RegExp(`^const ${name}\\s*=`);
  const hits = lines.map((l, i) => (re.test(l) ? i : -1)).filter(i => i >= 0);
  if (hits.length !== 1) {
    problems.push(`Expected exactly one "const ${name} =" but found ${hits.length}`);
    return null;
  }
  const start = hits[0];
  let end = start + 1;
  while (end < lines.length && !TOP.test(lines[end])) end++;
  while (end > start + 1 && lines[end - 1].trim() === "") end--;
  const block = lines.slice(start, end).join("\n");
  const last = lines[end - 1].trim();
  if (!/[;]$/.test(last)) problems.push(`Block "${name}" does not end with ";" (ends: ${last.slice(-40)})`);
  return block;
}

// ---------- images ----------
const imageNames = [];
const imageLines = [];
for (const l of lines) {
  const m = l.match(/^import\s+([A-Za-z0-9_]+)\s+from\s+"\.\/assets\/(.+)";\s*$/);
  if (m) {
    imageNames.push(m[1]);
    imageLines.push(`import ${m[1]} from "../assets/${m[2]}";`);
  }
}
if (imageNames.length === 0) problems.push("No image imports found");

const usesWord = (body, w) => new RegExp(`\\b${w}\\b`).test(body);

function dataModule(blockNames, extraHeader = "") {
  const blocks = blockNames.map(getBlock);
  if (blocks.some(b => b === null)) return null;
  const body = blocks.map(b => b.replace(/^const /, "export const ")).join("\n\n");
  const usedImages = imageNames.filter(n => usesWord(body, n));
  const needsB = /\bB\.[a-zA-Z]/.test(body);
  const imports = [];
  if (needsB) imports.push(`import { B } from "./theme.js";`);
  if (usedImages.length) imports.push(`import { ${usedImages.join(", ")} } from "./images.js";`);
  return (extraHeader + (imports.length ? imports.join("\n") + "\n\n" : "") + body + "\n");
}

const outputs = {};

// theme
const bBlock = getBlock("B");
if (bBlock) outputs["src/data/theme.js"] = bBlock.replace(/^const /, "export const ") + "\n";

// images
outputs["src/data/images.js"] =
  imageLines.join("\n") + `\n\nexport {\n  ${imageNames.join(",\n  ")},\n};\n`;

// data modules
outputs["src/data/products.js"] = dataModule(["PRODUCTS", "SAMPLE_POT", "SAMPLE_BUNDLE"]);
outputs["src/data/storyPages.js"] = dataModule(["storyPages"]);
outputs["src/data/navData.js"] = dataModule(["navData"]);
outputs["src/data/colours.js"] = dataModule([
  "trendingColours", "CAT_SWATCH_COLORS", "COLOUR_CATEGORIES", "STYLE_CATEGORIES", "COLOUR_DETAILS",
]);
outputs["src/data/inspirations.js"] = dataModule([
  "BEDROOM_INSPIRATIONS", "LIVING_ROOM_INSPIRATIONS", "DINING_ROOM_INSPIRATIONS",
  "KITCHEN_INSPIRATIONS", "BATHROOM_INSPIRATIONS", "ROOM_META",
]);

// icons
const iconNames = [
  "CartIcon", "SearchIcon", "UserIcon", "ChevDown", "ChevRight", "MenuIcon", "CloseIcon", "Arr", "ArrL",
  "PhoneIcon", "MailIcon", "TruckIcon", "PaletteIcon", "HeartIcon", "GlobeIcon", "UsersIcon", "LeafIcon",
  "MinusIcon", "PlusIcon", "CheckIcon", "StarIcon",
];
const iconBlocks = iconNames.map(getBlock);
if (!iconBlocks.some(b => b === null)) {
  outputs["src/components/icons/Icons.jsx"] =
    iconBlocks.map(b => b.replace(/^const /, "export const ")).join("\n") + "\n";
}

// PaintBlob
const blob = getBlock("PaintBlob");
if (blob) {
  outputs["src/components/common/PaintBlob.jsx"] =
    blob.replace(/^const /, "const ") + "\n\nexport default PaintBlob;\n";
}

// global CSS (the big <style>{`...`}</style> block inside the main component)
const open = text.indexOf("<style>{`");
const close = text.indexOf("`}</style>");
if (open < 0 || close < 0 || close < open) {
  problems.push("Could not find the <style>{`...`}</style> block");
} else {
  let css = text.slice(open + "<style>{`".length, close);
  const theme = {};
  if (bBlock) for (const m of bBlock.matchAll(/(\w+):\s*"(#[0-9a-fA-F]+)"/g)) theme[m[1]] = m[2];
  css = css.replace(/\$\{B\.(\w+)\}/g, (_, k) => {
    if (!theme[k]) problems.push(`CSS uses unknown colour B.${k}`);
    return theme[k] || "inherit";
  });
  if (css.includes("${")) problems.push("CSS still contains a ${...} expression after substitution");
  if (css.includes("\\")) problems.push("CSS contains a backslash - check it by hand");
  outputs["src/styles/global.css"] = css.replace(/^\n/, "").replace(/\s+$/, "") + "\n";
}

// ---------- write ----------
if (problems.length) {
  console.error("\nStopped. Nothing was written because of these problems:\n");
  problems.forEach(p => console.error("  - " + p));
  console.error("\nCopy this message and send it to Claude.");
  process.exit(1);
}
for (const [file, content] of Object.entries(outputs)) {
  if (content === null) { console.error(`Skipped ${file}`); process.exit(1); }
}
for (const [file, content] of Object.entries(outputs)) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

// ---------- syntax check (uses esbuild, which Vite already installed) ----------
let esbuild = null;
try {
  const require = createRequire(path.resolve("package.json"));
  esbuild = require("esbuild");
} catch {
  console.warn("\n(esbuild not found - skipped the syntax check; npm run dev will still catch errors)");
}

console.log("\nCreated files:\n");
let failed = 0;
for (const [file, content] of Object.entries(outputs)) {
  let status = "";
  if (esbuild && /\.(js|jsx)$/.test(file)) {
    try {
      esbuild.transformSync(content, { loader: "jsx" });
      status = "syntax OK";
    } catch (e) {
      status = "SYNTAX ERROR: " + String(e.message).split("\n")[0];
      failed++;
    }
  }
  const exported = [...content.matchAll(/^export (?:const|default) (\w+)/gm)].map(m => m[1]);
  console.log(
    `  ${file.padEnd(42)} ${String(content.split("\n").length - 1).padStart(5)} lines  ${status}` +
    (exported.length && !file.includes("images") ? `\n      exports: ${exported.join(", ")}` : "")
  );
}
console.log(failed ? `\n${failed} file(s) had syntax errors - send this output to Claude.` : "\nDone. Your original file was not changed.");
