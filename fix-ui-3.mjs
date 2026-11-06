// UI fixes, round 3:
//  - About Us: the dark stats band (1988 / 36+ / 3 / Uganda) is removed (it stays available for any story page that has stats)
//  - colour cards: the extra small blob in the corner is removed (the big blob already shows the colour)
//  - home page slider: photos are read from the folder src/assets/hero/ (drop the model-painting photos there)
// Run from the project root AFTER fix-ui-2.mjs:  node fix-ui-3.mjs        Undo: git checkout . ; git clean -fd src
import fs from "node:fs";
import { createRequire } from "node:module";

const HERO_DATA = "// Photos for the home page slider. Put your photos in  src/assets/hero/  (JPG, PNG or WebP) and they appear in the slider\n// in file-name order (hero-1.jpg, hero-2.jpg, hero-3.jpg...). Until a photo exists for a slide, the built-in room picture is used.\nconst found = import.meta.glob(\"../assets/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}\", { eager: true, import: \"default\" });\nexport const HERO_PHOTOS = Object.keys(found).sort().map(k => found[k]);\nexport const heroPhoto = (i, fallback) => HERO_PHOTOS[i] || fallback;\n";
const CORNER = /\n[ \t]*<div style=\{\{ position: "absolute", bottom: 8, right: 10 \}\}><PaintBlob size=\{32\} color=\{c\.color\} v=\{i \+ 2\} \/><\/div>/;
const BAND = /\n[ \t]*<section style=\{\{ background: "#1a1a1a", color: "#fff", padding: "32px 0" \}\}>[\s\S]*?\n[ \t]*<\/section>/;

const problems = [], notes = [], contents = {};
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const files = ["src/pages/StoryPage.jsx", "src/data/storyPages.js", "src/pages/AllColoursPage.jsx", "src/pages/ColourCategoryPage.jsx", "src/components/home/Hero.jsx"];
for (const f of files) { if (!fs.existsSync(f)) problems.push("Missing " + f); else contents[f] = read(f); }
if (fs.existsSync("src/data/heroPhotos.js")) problems.push("This looks already applied");
if (contents["src/pages/AllColoursPage.jsx"] && !contents["src/pages/AllColoursPage.jsx"].includes("PaintBlob size={32}") && !contents["src/pages/ColourCategoryPage.jsx"].includes("PaintBlob size={32}")) problems.push("Run fix-ui-2.mjs first");

const once = (f, find, rep, what) => {
  const n = typeof find === "string" ? contents[f].split(find).length - 1 : (contents[f].match(new RegExp(find.source, "g")) || []).length;
  if (n !== 1) problems.push(f + ": expected 1 match, found " + n + " for " + what); else contents[f] = contents[f].replace(find, () => rep);
};
if (contents["src/pages/StoryPage.jsx"]) {
  const f = "src/pages/StoryPage.jsx";
  const m = BAND.exec(contents[f]);
  if (!m) problems.push(f + ": could not find the dark stats band");
  else once(f, BAND, "\n      {p.stats && p.stats.length > 0 && (" + m[0].replace(/\n/g, "\n  ") + "\n      )}", "the stats band");
}
if (contents["src/data/storyPages.js"]) once("src/data/storyPages.js", '    stats: [{ n: "1988", l: "Founded" }, { n: "36+", l: "Years" }, { n: "3", l: "Product ranges" }, { n: "Uganda", l: "Made in" }],', "    stats: [],", "the About stats line");
for (const f of ["src/pages/AllColoursPage.jsx", "src/pages/ColourCategoryPage.jsx"]) if (contents[f]) once(f, CORNER, "", "the corner blob");
const hf = "src/components/home/Hero.jsx";
if (contents[hf]) {
  once(hf, "roomImg: INSPO_SCANDI_SAGE,", "roomImg: heroPhoto(0, INSPO_SCANDI_SAGE),", "slide 1 photo");
  once(hf, "roomImg: INSPO_LR_PALE_BEIGE,", "roomImg: heroPhoto(1, INSPO_LR_PALE_BEIGE),", "slide 2 photo");
  once(hf, "roomImg: INSPO_KT_CREAM,", "roomImg: heroPhoto(2, INSPO_KT_CREAM),", "slide 3 photo");
  once(hf, 'import { trendingColours } from "../../data/colours.js";', 'import { trendingColours } from "../../data/colours.js";\nimport { heroPhoto } from "../../data/heroPhotos.js";', "the colours import");
}
try {
  const esbuild = createRequire(import.meta.url)("esbuild");
  for (const [n, c] of Object.entries(contents)) { try { esbuild.transformSync(c, { loader: "jsx" }); } catch (e) { problems.push("Syntax problem in " + n + ": " + String(e.message).split("\n")[0]); } }
} catch { notes.push("esbuild not found, so no syntax check here; run npx eslint src afterwards"); }
if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }
fs.writeFileSync("src/data/heroPhotos.js", HERO_DATA);
fs.mkdirSync("src/assets/hero", { recursive: true });
for (const [f, c] of Object.entries(contents)) fs.writeFileSync(f, c);
console.log("\nDone: About has no stats band, colour cards lose the corner blob, and the home slider reads photos from src/assets/hero/.");
notes.forEach(n => console.log("Note: " + n));
console.log("\nNext: npx eslint src, then npm run dev. To use your model photos, copy them into src\\assets\\hero\\ and name them hero-1.jpg, hero-2.jpg, hero-3.jpg.\nUndo anytime with:  git checkout . ; git clean -fd src");
