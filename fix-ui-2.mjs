// UI fixes, round 2:
//  - every colour swatch is now a glossy paint blob (colour pages, colour cards, filters, product colour chip, the menu)
//  - Whites merged into Neutrals (one collection, whites listed first)
//  - delivery wording: "Delivery available."
// Run from the project root AFTER fix-ui-1.mjs:  node fix-ui-2.mjs        Undo: git checkout . ; git clean -fd src
import fs from "node:fs";
import { createRequire } from "node:module";

const BLOB = "import { useId } from \"react\";\n\n// A glossy blob of wet paint: a darker layer underneath, the colour on top, a lighter inner layer and shiny highlights.\n// Used for every colour swatch on the site. size = pixels (small dots); leave it out to fill the parent.\nconst PATHS = [\n  \"M52 6C74 4 95 20 94 45C93 66 82 90 56 93C32 96 8 82 6 56C4 30 28 8 52 6Z\",\n  \"M48 5C72 8 93 24 92 50C91 74 70 95 46 92C24 89 5 72 8 48C11 24 28 3 48 5Z\",\n  \"M58 7C80 12 96 32 91 56C86 80 66 96 42 91C20 86 4 66 9 42C14 20 36 2 58 7Z\",\n  \"M45 8C68 3 92 18 94 42C96 68 78 92 52 94C28 96 6 78 6 54C6 30 22 12 45 8Z\",\n];\n\nfunction shade(hex, amount) {\n  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || \"\").trim());\n  if (!m) return \"#999999\";\n  const n = parseInt(m[1], 16);\n  const mix = c => Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount);\n  return \"#\" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c => Math.max(0, Math.min(255, mix(c))).toString(16).padStart(2, \"0\")).join(\"\");\n}\n\nexport default function PaintBlob({ color = \"#cccccc\", v = 0, size, style }) {\n  const id = useId().replace(/:/g, \"\");\n  const d = PATHS[Math.abs(Math.round(Number(v) || 0)) % PATHS.length];\n  const dark = shade(color, -0.3), light = shade(color, 0.28);\n  const dim = size ? { width: size, height: size } : { width: \"100%\", height: \"100%\" };\n  return (\n    <svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\" style={{ display: \"block\", flexShrink: 0, overflow: \"visible\", ...dim, ...style }}>\n      <defs>\n        <radialGradient id={id + \"b\"} cx=\"34%\" cy=\"26%\" r=\"90%\">\n          <stop offset=\"0\" stopColor={light} />\n          <stop offset=\".5\" stopColor={color} />\n          <stop offset=\"1\" stopColor={dark} />\n        </radialGradient>\n        <radialGradient id={id + \"s\"} cx=\"50%\" cy=\"50%\" r=\"50%\">\n          <stop offset=\"0\" stopColor=\"#fff\" stopOpacity=\".95\" />\n          <stop offset=\"1\" stopColor=\"#fff\" stopOpacity=\"0\" />\n        </radialGradient>\n      </defs>\n      <path d={d} transform=\"translate(2.5 5)\" fill={dark} opacity=\".6\" />\n      <path d={d} fill={\"url(#\" + id + \"b)\"} stroke=\"rgba(0,0,0,.12)\" strokeWidth=\".8\" />\n      <path d={d} transform=\"translate(8 8) scale(.84)\" fill=\"none\" stroke={light} strokeOpacity=\".5\" strokeWidth=\"1.3\" />\n      <ellipse cx=\"32\" cy=\"25\" rx=\"16\" ry=\"8\" transform=\"rotate(-32 32 25)\" fill={\"url(#\" + id + \"s)\"} />\n      <ellipse cx=\"69\" cy=\"74\" rx=\"10\" ry=\"3.2\" transform=\"rotate(-35 69 74)\" fill=\"#fff\" opacity=\".28\" />\n      <circle cx=\"24\" cy=\"39\" r=\"2.6\" fill=\"#fff\" opacity=\".85\" />\n    </svg>\n  );\n}\n";
const IMPORT_ABS = 'import PaintBlob from "../components/common/PaintBlob.jsx";\n';
const IMPORT_LAYOUT = 'import PaintBlob from "../common/PaintBlob.jsx";\n';

// [find, replacement, optional?]  A required find must occur exactly once. Optional ones are skipped with a note when not found.
const EDITS = {
  "src/pages/AllColoursPage.jsx": [
    ['<span style={{ width: 14, height: 14, borderRadius: "50%", background: CAT_SWATCH_COLORS[name] || "#ddd", border: "1px solid rgba(0,0,0,.15)" }} />', '<PaintBlob size={18} color={CAT_SWATCH_COLORS[name] || "#ddd"} v={name.length} />'],
    ['<div style={{ position: "absolute", bottom: 10, right: 12, width: 28, height: 28, borderRadius: "50%", background: c.color, border: "3px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(0,0,0,.12)" }} />', '<div style={{ position: "absolute", bottom: 8, right: 10 }}><PaintBlob size={32} color={c.color} v={i + 2} /></div>'],
  ],
  "src/pages/ColourCategoryPage.jsx": [
    ['<div style={{ width: 18, height: 18, borderRadius: "50%", background: c.color, border: "1px solid rgba(0,0,0,.1)", flexShrink: 0 }} />', '<PaintBlob size={22} color={c.color} v={i} />'],
    ['<div style={{ position: "absolute", bottom: 10, right: 12, width: 28, height: 28, borderRadius: "50%", background: c.color, border: "3px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(0,0,0,.12)" }} />', '<div style={{ position: "absolute", bottom: 8, right: 10 }}><PaintBlob size={32} color={c.color} v={i + 2} /></div>'],
    ['<div style={{ width: 24, height: 24, borderRadius: "50%", background: CAT_SWATCH_COLORS[name] || "#ddd", border: "2px solid rgba(0,0,0,.08)", flexShrink: 0 }} />', '<PaintBlob size={28} color={CAT_SWATCH_COLORS[name] || "#ddd"} v={name.length} />'],
  ],
  "src/pages/ColourDetailPage.jsx": [
    [/<div style=\{\{\s*width: 68, height: 68, borderRadius: "50%",[\s\S]*?\}\} \/>/, '<div style={{ width: 88, height: 88, flexShrink: 0, filter: "drop-shadow(0 8px 16px rgba(0,0,0,.22))" }}><PaintBlob color={colour.color} v={1} /></div>'],
    ['<div style={{ width: 32, height: 32, borderRadius: "50%", background: colour.color, border: "2px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />', '<PaintBlob size={36} color={colour.color} v={1} />', true],
  ],
  "src/pages/ProductDetailPage.jsx": [
    ['<span style={{ width: 20, height: 20, borderRadius: "50%", background: colourChip.color, border: "1px solid rgba(0,0,0,.12)" }} />', '<PaintBlob size={24} color={colourChip.color} v={1} />', true],
  ],
  "src/components/layout/Header.jsx": [
    ['<span className="pill-dot" style={{ background: f.color }} />', '<PaintBlob size={28} color={f.color} v={f.label.length} />', true],
  ],
  "src/components/layout/MobileMenu.jsx": [
    ['<span className="pill-dot" style={{ background: f.color }} />', '<PaintBlob size={26} color={f.color} v={f.label.length} />', true],
  ],
  "src/config/business.js": [
    ['delivery: "We deliver around Kampala for orders above UGX 3,000,000.",', 'delivery: "Delivery available.",'],
  ],
};
// files that need the PaintBlob import added when an edit to them was applied (and it is not imported already)
const NEEDS_IMPORT = { "src/pages/ColourDetailPage.jsx": IMPORT_ABS, "src/pages/ProductDetailPage.jsx": IMPORT_ABS, "src/components/layout/Header.jsx": IMPORT_LAYOUT, "src/components/layout/MobileMenu.jsx": IMPORT_LAYOUT };

const problems = [], notes = [], contents = {}, applied = {};
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const must = ["src/pages/AllColoursPage.jsx", "src/pages/ColourCategoryPage.jsx", "src/pages/ColourDetailPage.jsx", "src/config/business.js", "src/data/colours.js"];
for (const f of [...Object.keys(EDITS), "src/data/colours.js"]) { if (!fs.existsSync(f)) { (must.includes(f) ? problems : notes).push((must.includes(f) ? "Missing " : "skipped, file not found: ") + f); } else contents[f] = read(f); }
if (!fs.existsSync("src/data/navData.js") || !read("src/data/navData.js").includes('direct: "vision"')) problems.push("Run fix-ui-1.mjs first");
if (fs.existsSync("src/components/common/PaintBlob.jsx") && read("src/components/common/PaintBlob.jsx").includes("useId")) problems.push("This looks already applied");

for (const [f, list] of Object.entries(EDITS)) {
  if (contents[f] === undefined) continue;
  for (const [find, rep, optional] of list) {
    const count = typeof find === "string" ? contents[f].split(find).length - 1 : (contents[f].match(new RegExp(find.source, "g")) || []).length;
    if (count === 0 && optional) { notes.push("skipped (text not found in " + f + ")"); continue; }
    if (count !== 1) { problems.push(f + ": expected 1 match, found " + count + " for: " + String(typeof find === "string" ? find : find.source).slice(0, 80)); continue; }
    contents[f] = contents[f].replace(find, () => rep); applied[f] = true;
  }
}
for (const [f, imp] of Object.entries(NEEDS_IMPORT)) if (applied[f] && !contents[f].includes("PaintBlob.jsx")) contents[f] = imp + contents[f];

// Whites -> Neutrals
const cf = "src/data/colours.js";
if (contents[cf]) {
  let t = contents[cf];
  const sw = t.match(/^[ \t]*"Whites":[ \t]*"#[0-9A-Fa-f]{6}",\n/m);
  const start = t.indexOf('  "Whites": {\n'), end = t.indexOf('  "Creams": {\n');
  const wl = start >= 0 ? /colors: \[([^\]]*)\]/.exec(t.slice(start, end)) : null;
  const nIdx = t.indexOf('slug: "neutrals-colour"');
  const nCol = nIdx >= 0 ? /colors: \[/.exec(t.slice(nIdx)) : null;
  if (!sw || start < 0 || end < start || !wl || !nCol) problems.push("src/data/colours.js: could not find the Whites and Neutrals collections as expected");
  else {
    t = t.replace(sw[0], "");
    const s2 = t.indexOf('  "Whites": {\n'), e2 = t.indexOf('  "Creams": {\n');
    t = t.slice(0, s2) + t.slice(e2);
    const n2 = t.indexOf('slug: "neutrals-colour"');
    const rel = /colors: \[/.exec(t.slice(n2));
    const at = n2 + rel.index + rel[0].length;
    const existing = /colors: \[([^\]]*)\]/.exec(t.slice(n2))[1];
    const names = s => s.split(",").map(x => x.trim()).filter(Boolean);
    const merged = [...new Set([...names(wl[1]), ...names(existing)])];
    const close = t.indexOf("]", at);
    t = t.slice(0, at) + merged.join(",") + t.slice(close);
    t = t.replace(/(slug: "neutrals-colour",[\s\S]*?desc: )"[^"]*"/, (_m, p) => p + '"Whites, off-whites, taupes, tans and warm greiges: effortlessly versatile backdrops that complement any style"');
    contents[cf] = t;
  }
}
try {
  const esbuild = createRequire(import.meta.url)("esbuild");
  const check = (n, c) => { try { esbuild.transformSync(c, { loader: "jsx" }); } catch (e) { problems.push("Syntax problem in " + n + ": " + String(e.message).split("\n")[0]); } };
  check("src/components/common/PaintBlob.jsx", BLOB);
  for (const [n, c] of Object.entries(contents)) check(n, c);
} catch { notes.push("esbuild not found, so no syntax check here; run npx eslint src afterwards"); }
if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }
fs.mkdirSync("src/components/common", { recursive: true });
fs.writeFileSync("src/components/common/PaintBlob.jsx", BLOB);
for (const [f, c] of Object.entries(contents)) fs.writeFileSync(f, c);
console.log("\nDone: paint-blob swatches everywhere, Whites merged into Neutrals, delivery wording changed.");
notes.forEach(n => console.log("Note: " + n));
console.log("\nNext: npx eslint src, then npm run dev and look at Colours (All colours, a collection, a colour page), the Colours menu, and a product's colour picker.\nUndo anytime with:  git checkout . ; git clean -fd src");
