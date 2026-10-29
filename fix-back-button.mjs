// Makes the browser Back/Forward buttons work.
// The site already listens for URL (#/...) changes, but nav() / openProduct() / handleColourClick()
// used history.replaceState, which overwrites the current history entry instead of adding one.
// Setting window.location.hash adds a history entry AND triggers the listener that already exists.
// Run from the project root:  node fix-back-button.mjs      Undo with:  git checkout .

import fs from "node:fs";

const FILE = "src/context/AppContext.jsx";
if (!fs.existsSync(FILE)) { console.error(`Cannot find ${FILE}. Run this from the project root.`); process.exit(1); }
let t = fs.readFileSync(FILE, "utf8").replace(/\r\n/g, "\n");

const edits = [
  ['window.history.replaceState(null, "", `#/${p}`);',
   'window.location.hash = `/${p}`;'],
  ['window.history.replaceState(null, "", `#/product/${p.id}`);',
   'window.location.hash = `/product/${p.id}`;'],
  ['window.history.replaceState(null, "", `#/colour/${encodeURIComponent(c.name)}`);',
   'window.location.hash = `/colour/${encodeURIComponent(c.name)}`;'],
];

const problems = [];
for (const [find] of edits) {
  const n = t.split(find).length - 1;
  if (n !== 1) problems.push(`expected 1 match, found ${n} for: ${find}`);
}
if (/replaceState/.test(t.replace(edits.map(e => e[0]).join("\n"), "")) && problems.length === 0) {
  // other replaceState calls are fine to leave, just report them
}
if (problems.length) {
  console.error("\nStopped. Nothing was changed because of these problems:\n");
  problems.forEach(p => console.error("  - " + p));
  console.error("\nCopy this message and send it to Claude.");
  process.exit(1);
}
for (const [find, repl] of edits) t = t.replace(find, () => repl);
fs.writeFileSync(FILE, t, "utf8");

const left = t.split("\n").map((l, i) => [l, i + 1]).filter(([l]) => /replaceState/.test(l));
console.log("\nDone. 3 navigation calls now add real history entries.");
if (left.length) console.log("Other replaceState calls left alone:\n" + left.map(([l, i]) => `  ${FILE}:${i}  ${l.trim().slice(0, 90)}`).join("\n"));
console.log("\nTest in the browser (npm run dev):");
console.log("  1. Open the home page, click a colour, then click a category, then press the browser Back button.");
console.log("  2. Back should return you to the previous page, one step at a time. Forward should work too.");
