// Adds "Complementary colours" under every colour page: the Peacock shades opposite on the colour wheel (named from the chart).
// Run from the project root AFTER fix-ui-2.mjs:  node add-complements.mjs      Undo: git checkout . ; git clean -fd src
import fs from "node:fs";
import { createRequire } from "node:module";

const UTIL = "// Complementary colours: the shades that sit opposite on the colour wheel (180 degrees away in CIE Lab hue).\n// Every answer is a real shade from the Peacock chart (trendingColours), never an invented colour.\nconst toLab = hex => {\n  const lin = c => { c /= 255; return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92; };\n  const r = lin(parseInt(hex.slice(1, 3), 16)), g = lin(parseInt(hex.slice(3, 5), 16)), b = lin(parseInt(hex.slice(5, 7), 16));\n  const f = t => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);\n  const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047), y = f(0.2126 * r + 0.7152 * g + 0.0722 * b), z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);\n  const L = 116 * y - 16, a = 500 * (x - y), bb = 200 * (y - z);\n  return { L, a, b: bb, C: Math.hypot(a, bb), H: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 };\n};\nconst hueGap = (p, q) => { const d = Math.abs(p - q) % 360; return Math.min(d, 360 - d); };\n\n// Returns up to `count` Peacock shades, best match first.\nexport function complementsFor(colour, all, count = 3) {\n  if (!colour || !colour.color) return [];\n  const me = toLab(colour.color);\n  const targetH = (me.H + 180) % 360;\n  // Keep the same lightness, and give very pale/grey shades enough colour for the opposite to be noticeable.\n  const targetC = Math.max(me.C, 28);\n  const ta = targetC * Math.cos((targetH * Math.PI) / 180), tb = targetC * Math.sin((targetH * Math.PI) / 180);\n  return all\n    .filter(c => c.name !== colour.name && c.color)\n    .map(c => ({ c, lab: toLab(c.color) }))\n    .filter(x => x.lab.C >= 12 && hueGap(x.lab.H, targetH) <= 30)\n    .map(x => ({ c: x.c, d: Math.hypot(x.lab.L - me.L, x.lab.a - ta, x.lab.b - tb) }))\n    .sort((p, q) => p.d - q.d)\n    .slice(0, count)\n    .map(x => x.c);\n}\n";
const BAND = "import { B } from \"../../data/theme.js\";\nimport { trendingColours } from \"../../data/colours.js\";\nimport { complementsFor } from \"../../utils/complement.js\";\nimport { useApp } from \"../../context/useApp.js\";\nimport PaintBlob from \"../common/PaintBlob.jsx\";\n\n// \"Complementary colours\" band for a colour page: the shades opposite on the colour wheel, all from the Peacock chart.\nexport default function ComplementBand({ colour }) {\n  const { handleColourClick } = useApp();\n  const matches = complementsFor(colour, trendingColours, 3);\n  if (!matches.length) return null;\n  return (\n    <section aria-label=\"Complementary colours\" style={{ background: \"#faf8f5\", borderTop: \"1px solid #eee\", padding: \"44px 24px 52px\" }}>\n      <div style={{ maxWidth: 1000, margin: \"0 auto\", textAlign: \"center\" }}>\n        <p style={{ fontSize: 12, textTransform: \"uppercase\", letterSpacing: 2, color: B.coral, fontWeight: 600, marginBottom: 6 }}>Colour match</p>\n        <h2 style={{ fontFamily: \"'Playfair Display', serif\", fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Complementary colours</h2>\n        <p style={{ fontSize: 14, color: \"#666\", maxWidth: 520, margin: \"0 auto 28px\", lineHeight: 1.6 }}>\n          These Peacock shades sit opposite {colour.name} on the colour wheel, so they bring out the best in each other.\n        </p>\n        <div style={{ display: \"flex\", justifyContent: \"center\", alignItems: \"center\", gap: 18, flexWrap: \"wrap\" }}>\n          <div style={{ textAlign: \"center\", width: 110 }}>\n            <div style={{ width: 96, height: 96, margin: \"0 auto 8px\" }}><PaintBlob color={colour.color} v={0} /></div>\n            <div style={{ fontSize: 13, fontWeight: 700 }}>{colour.name}</div>\n          </div>\n          <span aria-hidden=\"true\" style={{ fontSize: 28, fontWeight: 300, color: B.coral }}>+</span>\n          {matches.map((m, i) => (\n            <button key={m.name} onClick={() => { handleColourClick(m); window.scrollTo(0, 0); }} aria-label={\"View \" + m.name}\n              style={{ background: \"none\", border: \"none\", cursor: \"pointer\", textAlign: \"center\", width: 110, padding: 0, fontFamily: \"inherit\" }}>\n              <div style={{ width: 96, height: 96, margin: \"0 auto 8px\" }}><PaintBlob color={m.color} v={i + 1} /></div>\n              <div style={{ fontSize: 13, fontWeight: 700, color: \"#222\" }}>{m.name}</div>\n              <div style={{ fontSize: 11.5, color: \"#888\" }}>{i === 0 ? \"Closest match\" : \"Also works\"}</div>\n            </button>\n          ))}\n        </div>\n      </div>\n    </section>\n  );\n}\n";
const problems = [], notes = [];
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const page = "src/pages/ColourDetailPage.jsx";
if (fs.existsSync("src/utils/complement.js")) problems.push("This looks already applied");
if (!fs.existsSync("src/components/common/PaintBlob.jsx")) problems.push("Run fix-ui-2.mjs first (it creates PaintBlob.jsx)");
if (!fs.existsSync("src/data/colours.js")) problems.push("Missing src/data/colours.js");
if (!fs.existsSync("src/context/useApp.js")) problems.push("Missing src/context/useApp.js");
let src = "";
if (!fs.existsSync(page)) problems.push("Missing " + page); else {
  src = read(page);
  const imp = 'import { CloseIcon, Arr, ArrL, MinusIcon, PlusIcon, CheckIcon } from "../components/icons/Icons.jsx";';
  const tail = "\n    </div>\n  );\n};\n\nexport default ColourDetailPage;";
  for (const [find, rep, what] of [
    [imp, imp + '\nimport ComplementBand from "../components/colours/ComplementBand.jsx";', "the icons import"],
    [tail, "\n      <ComplementBand colour={colour} />" + tail, "the end of the page"],
  ]) { const n = src.split(find).length - 1; if (n !== 1) problems.push(page + ": expected 1 match, found " + n + " for " + what); else src = src.replace(find, () => rep); }
}
try {
  const esbuild = createRequire(import.meta.url)("esbuild");
  for (const [n, c] of [[page, src], ["ComplementBand.jsx", BAND], ["complement.js", UTIL]]) { if (!c) continue; try { esbuild.transformSync(c, { loader: "jsx" }); } catch (e) { problems.push("Syntax problem in " + n + ": " + String(e.message).split("\n")[0]); } }
} catch { notes.push("esbuild not found, so no syntax check here; run npx eslint src afterwards"); }
if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }
fs.mkdirSync("src/utils", { recursive: true });
fs.mkdirSync("src/components/colours", { recursive: true });
fs.writeFileSync("src/utils/complement.js", UTIL);
fs.writeFileSync("src/components/colours/ComplementBand.jsx", BAND);
fs.writeFileSync(page, src);
console.log("\nDone. Every colour page now has a Complementary colours band at the bottom.");
notes.forEach(x => console.log("Note: " + x));
console.log("\nNext: npx eslint src, then npm run dev and open any colour.\nUndo anytime with:  git checkout . ; git clean -fd src");
