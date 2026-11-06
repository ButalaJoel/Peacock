// UI fixes, round 1 (from the management meeting):
//  - bigger logo in the top bar (desktop and phone)
//  - Thinners & Solvents removed from the Decorative menu column (still under Industrial / Protective and Wood care)
//  - clicking "Our Story" in the top bar opens Vision, Mission and Values directly (hovering still shows the menu)
//  - "Our" dropped from the section titles on the story pages (Vision, Mission, Core values, History)
// Run from the project root:  node fix-ui-1.mjs        Undo: git checkout . ; git clean -fd src
import fs from "node:fs";
import { createRequire } from "node:module";

// each edit: [find, replacement, optional?]. A required find must occur exactly once; optional ones are skipped with a note.
const EDITS = {
  "src/styles/global.css": [
    [".pill-bar { max-width: 1240px; margin: 0 auto; height: 64px;", ".pill-bar { max-width: 1240px; margin: 0 auto; height: 80px;"],
    [".pill-logo img { height: 44px; display: block; }", ".pill-logo img { height: 60px; width: auto; display: block; }"],
    [".pill-bar { height: 56px; padding: 0 8px 0 16px; } .pill-logo img { height: 38px; }", ".pill-bar { height: 66px; padding: 0 8px 0 16px; } .pill-logo img { height: 48px; }"],
  ],
  "src/data/navData.js": [
    ['        { label: "Primers", page: "decorative-paints-primers" },\n        { label: "Thinners & Solvents", page: "thinners-solvents" },\n      ], footer: { label: "All decorative paints"', '        { label: "Primers", page: "decorative-paints-primers" },\n      ], footer: { label: "All decorative paints"'],
    ['id: "story", label: "Our Story",', 'id: "story", label: "Our Story", direct: "vision",'],
  ],
  "src/components/layout/Header.jsx": [
    ["onClick={() => { setPinned(pinned === i ? null : i); mE(i); }}>", "onClick={() => { if (m.direct) { setActiveMenu(null); setPinned(null); nav(m.direct); return; } setPinned(pinned === i ? null : i); mE(i); }}>"],
  ],
  "src/data/storyPages.js": [
    ['t: "Our vision"', 't: "Vision"', true],
    ['t: "Our mission"', 't: "Mission"', true],
    ['t: "Our core values"', 't: "Core values"', true],
    ['t: "Our history"', 't: "History"', true],
  ],
};
const problems = [], notes = [], contents = {};
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
for (const f of Object.keys(EDITS)) { if (!fs.existsSync(f)) problems.push("Missing " + f); else contents[f] = read(f); }
if (contents["src/data/navData.js"] && contents["src/data/navData.js"].includes('direct: "vision"')) problems.push("This looks already applied");
for (const [f, list] of Object.entries(EDITS)) {
  if (!contents[f]) continue;
  for (const [find, rep, optional] of list) {
    const n = contents[f].split(find).length - 1;
    if (n === 0 && optional) { notes.push("skipped (text not found in " + f + "): " + find); continue; }
    if (n !== 1) problems.push(f + ": expected 1 match, found " + n + " for: " + find.slice(0, 80)); else contents[f] = contents[f].replace(find, () => rep);
  }
}
try {
  const esbuild = createRequire(import.meta.url)("esbuild");
  for (const [n, c] of Object.entries(contents)) if (/\.jsx?$/.test(n)) { try { esbuild.transformSync(c, { loader: "jsx" }); } catch (e) { problems.push("Syntax problem in " + n + ": " + String(e.message).split("\n")[0]); } }
} catch { notes.push("esbuild not found, so no syntax check here; run npx eslint src afterwards"); }
if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }
for (const [f, c] of Object.entries(contents)) fs.writeFileSync(f, c);
console.log("\nDone: bigger logo, thinners out of Decorative, Our Story opens Vision directly, story titles without \"Our\".");
notes.forEach(n => console.log("Note: " + n));
console.log("\nNext: npx eslint src, then npm run dev and look at the top bar (desktop and phone width) and click Our Story.\nUndo anytime with:  git checkout . ; git clean -fd src");
