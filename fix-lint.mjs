// Fixes the 3 ESLint errors: ColourPickerPage (ref read during render) and advisor.js (unused helper).
// Run from the project root:  node fix-lint.mjs      Undo: git checkout .
import fs from "node:fs";
import { createRequire } from "node:module";

const EDITS = {
  "src/pages/ColourPickerPage.jsx": [
    ["return { rgb, left: e.clientX - box.left, top: e.clientY - box.top };", "return { rgb, left: e.clientX - box.left, top: e.clientY - box.top, width: box.width };"],
    ["(boxRef.current ? boxRef.current.clientWidth : 700)", "hover.width"],
  ],
  "src/utils/advisor.js": [
    ["const has = (text, re) => re.test(text);\n", ""],
  ],
};
const problems = [], contents = {};
for (const [f, list] of Object.entries(EDITS)) {
  if (!fs.existsSync(f)) { problems.push("Missing " + f); continue; }
  contents[f] = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
  for (const [find, rep] of list) {
    const n = contents[f].split(find).length - 1;
    if (n !== 1) { problems.push(f + ": expected 1 match, found " + n + " for: " + find.slice(0, 60)); continue; }
    contents[f] = contents[f].replace(find, () => rep);
  }
}
if (contents["src/utils/advisor.js"] && /(^|[^.\w])has\(/.test(contents["src/utils/advisor.js"])) problems.push("advisor.js still uses has(), not removing it");
try {
  const esbuild = createRequire(import.meta.url)("esbuild");
  for (const [n, c] of Object.entries(contents)) { try { esbuild.transformSync(c, { loader: "jsx" }); } catch (e) { problems.push("Syntax problem in " + n + ": " + String(e.message).split("\n")[0]); } }
} catch { /* esbuild not found: eslint will check */ }
if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }
for (const [f, c] of Object.entries(contents)) fs.writeFileSync(f, c);
console.log("\nDone. Fixed 3 lint errors.\nNext: npx eslint src   then   npm run build\nUndo with: git checkout .");
