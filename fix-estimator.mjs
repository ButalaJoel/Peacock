// Estimator: adds weight-based products (undercoat putty, mastic textured paint, Venetian stucco, Skimmex, Aquaphob),
// and the warning that rough surfaces use 25 to 30% more paint. No prices. Fonts are not touched.
// Run from the project root AFTER fix-catalogue.mjs:  node fix-estimator.mjs
// EDITS: src/data/estimatorProducts.js, src/pages/EstimatorPage.jsx
// Undo: git checkout . ; git clean -fd src
import fs from "node:fs";
import { createRequire } from "node:module";

const PRODUCTS_FILE = "src/data/estimatorProducts.js", PAGE_FILE = "src/pages/EstimatorPage.jsx";
const NEW_PRODUCTS = "\n  // Weight-based products. perKg = [fewest, most] square metres covered by one kilogram, exactly from the catalogue.\n  // packs = the pack sizes sold, in kilograms, exactly as they are named in the catalogue.\n  \"undercoat-putty\": { perKg: [1, 1], packs: [{ size: \"30kg\", kg: 30 }, { size: \"6kg\", kg: 6 }, { size: \"1kg\", kg: 1 }] },\n  \"mastic-textured-paint\": { perKg: [2, 2], packs: [{ size: \"30kg\", kg: 30 }] },\n  \"venetian-stucco\": { perKg: [0.83, 1], packs: [{ size: \"20kg\", kg: 20 }, { size: \"4kg\", kg: 4 }, { size: \"1kg\", kg: 1 }], note: \"Catalogue: 1 to 1.2 kg per Sqm.\" },\n  \"skimmex\": { perKg: [0.5, 0.5], packs: [{ size: \"20kg\", kg: 20 }], note: \"Catalogue: 1 kg covers 0.5 Sqm.\" },\n  \"aquaphob\": { perKg: [1, 1], packs: [{ size: \"Part A 20kg sack + Part B 5L jerrycan\", kg: 20 }], note: \"Sold as a 20 kg sack plus a 5 L jerrycan, mixed together.\" },\n";
const ESTIMATE_KG = "\n// Weight-based products: perKg = [fewest, most] square metres covered by one kilogram; packs = [{ size, kg }].\nfunction estimateKg(config, area, coats) {\n  if (!(area > 0)) return null;\n  const need = area * coats;\n  const round = n => Math.round(n * 10) / 10;\n  const kgFewest = round(need / config.perKg[1]);\n  const kgRecommended = round(need / config.perKg[0]);\n  const packs = config.packs.slice().sort((a, b) => b.kg - a.kg);\n  let left = Math.ceil(kgRecommended);\n  const items = [];\n  packs.forEach((p, i) => {\n    const qty = i === packs.length - 1 ? Math.ceil(left / p.kg) : Math.floor(left / p.kg);\n    if (qty > 0) items.push({ size: p.size, qty });\n    left -= qty * p.kg;\n  });\n  const per = config.perKg[0] === config.perKg[1] ? config.perKg[0] : config.perKg[0] + \" to \" + config.perKg[1];\n  return {\n    type: \"kg\", area, coats, kgFewest, kgRecommended, items, needsReview: false,\n    assumption: \"1 kg covers \" + per + \" m² (catalogue figure), for \" + coats + (coats === 1 ? \" coat\" : \" coats\") + \". Packs are rounded up to whole packs.\",\n  };\n}\n";

const EDITS = {
  [PRODUCTS_FILE]: [
    ['  "1k-polyurethane-varnish": { perLitre: [7, 7.5], note: "Catalogue: 4L covers 28-30 Sqm." },\n};', '  "1k-polyurethane-varnish": { perLitre: [7, 7.5], note: "Catalogue: 4L covers 28-30 Sqm." },\n' + NEW_PRODUCTS + '};'],
  ],
  [PAGE_FILE]: [
    ['const money = n => "UGX " + Math.round(n).toLocaleString();', 'const money = n => "UGX " + Math.round(n).toLocaleString();\n' + ESTIMATE_KG],
    ['  const result = estimate(product, config, { area, coats, variantIndex });', '  const result = config.perKg ? estimateKg(config, area, coats) : estimate(product, config, { area, coats, variantIndex });'],
    ['{result.type === "kit"', '{result.type === "kg" ? (result.kgFewest === result.kgRecommended ? result.kgRecommended : result.kgFewest + " to " + result.kgRecommended) + " kg" : result.type === "kit"'],
    ['This is an estimate, not a guarantee. Actual use depends on the surface condition, preparation, application method and conditions.', 'This is an estimate, not a guarantee. Actual use depends on the surface condition, preparation, application method and conditions. Rough surfaces, such as roughcast, bare block or unplastered concrete, can use 25 to 30% more than the figures shown.'],
    ['Check the product guidance for how many coats your surface needs.', 'Check the product guidance for how many coats your surface needs. Rough surfaces use 25 to 30% more.'],
    ['Not every product can be calculated here yet. For anything not listed, such as putties, stuccos, powders and two-part waterproofing systems, request a quote and our sales team will work out the quantity with you.', 'Not every product can be calculated here yet. For anything not listed, request a quote and our sales team will work out the quantity with you.'],
  ],
};

const problems = [], notes = [], contents = {};
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
for (const f of Object.keys(EDITS)) { if (!fs.existsSync(f)) problems.push("Missing " + f); else contents[f] = read(f); }
if (contents[PRODUCTS_FILE] && contents[PRODUCTS_FILE].includes("perKg")) problems.push("The estimator already has the weight-based products");
const cat = "src/data/products.catalogue.js";
if (!fs.existsSync(cat) || !read(cat).includes("Part A 20kg sack + Part B 5L jerrycan")) problems.push("Run fix-catalogue.mjs first (the Aquaphob and Skimmex pack sizes are not fixed yet)");
for (const [f, list] of Object.entries(EDITS)) {
  if (!contents[f]) continue;
  for (const [find, rep] of list) {
    const n = contents[f].split(find).length - 1;
    if (n !== 1) problems.push(f + ": expected 1 match, found " + n + " for: " + find.slice(0, 70)); else contents[f] = contents[f].replace(find, () => rep);
  }
}
try {
  const esbuild = createRequire(import.meta.url)("esbuild");
  for (const [n, c] of Object.entries(contents)) { try { esbuild.transformSync(c, { loader: "jsx" }); } catch (e) { problems.push("Syntax problem in " + n + ": " + String(e.message).split("\n")[0]); } }
} catch { notes.push("esbuild not found, so no syntax check here; run npx eslint src afterwards"); }

if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }
for (const [f, c] of Object.entries(contents)) fs.writeFileSync(f, c);
console.log("\nDone. The estimator now handles Undercoat Putty, Mastic Textured Paint, Venetian Stucco, Skimmex and Aquaphob (in kg), and warns about rough surfaces.");
notes.forEach(n => console.log("Note: " + n));
console.log("\nNext:\n  1. npx eslint src\n  2. npm run dev, open #/estimator and try each new product\nUndo anytime with:  git checkout . ; git clean -fd src");
