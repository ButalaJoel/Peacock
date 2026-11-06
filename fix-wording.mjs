// Two wording fixes:
//  - Skimmex mixing: 1 litre of water for every 0.5kg of powder (40 litres per 20kg sack)
//  - Epoxy Self Levelling: coverage stated as 4 Sqm per litre
// Run from the project root:  node fix-wording.mjs      Undo: git checkout .
import fs from "node:fs";
const problems = [];
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const files = { "src/data/products.catalogue.js": null, "src/data/estimatorProducts.js": null };
for (const f of Object.keys(files)) { if (!fs.existsSync(f)) problems.push("Missing " + f); else files[f] = read(f); }
const once = (f, find, rep, what) => {
  if (files[f] === null) return;
  const c = files[f].split(find).length - 1;
  if (c !== 1) problems.push(f + ": expected 1 match, found " + c + " for " + what); else files[f] = files[f].replace(find, () => rep);
};
once("src/data/products.catalogue.js",
  "6-8 kgs of water, then slowly empty the contents of the bag into the water and mix with a hand mixer for 5 mins.",
  "1 litre of water for every 0.5kg of powder (40 litres of water per 20kg sack). Pour the water into a clean container first, then slowly empty the sack into the water and mix with a hand mixer for 5 minutes.",
  "the Skimmex mixing text");
once("src/data/estimatorProducts.js",
  '"epoxy-self-levelling": { perLitre: [4, 4], needsReview: true },',
  '"epoxy-self-levelling": { perLitre: [4, 4], note: "Coverage: 4 Sqm per litre." },',
  "the Epoxy Self Levelling coverage line");
if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }
for (const [f, c] of Object.entries(files)) fs.writeFileSync(f, c);
console.log("\nDone: Skimmex now says 40 litres of water per 20kg sack, and Epoxy Self Levelling says 4 Sqm per litre.\nNext: npx eslint src, then npm run dev.  Undo anytime with:  git checkout .");
