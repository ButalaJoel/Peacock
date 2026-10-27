// Removes every price from the site and turns the cart into a quote-request list.
// Run from the project root:  node remove-pricing.mjs
//
// All edits are checked first. If ANY edit does not match exactly once, nothing is
// changed and you get a list of what did not match. Undo anytime with:  git checkout .

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const EDITS = {
  "src/PeacockPaintsWebsite.jsx": [
    // top bar
    ['<span style={{ display: "flex", alignItems: "center", gap: 6 }}><TruckIcon /> Free delivery over UGX 200,000</span>',
     '<span style={{ display: "flex", alignItems: "center", gap: 6 }}>Request a quote for any product</span>'],
    ['<PaletteIcon /> 5 colour samples for UGX 15,000',
     '<PaletteIcon /> Order colour samples'],
    // sample items no longer carry a price
    ['addToCart({ product: SAMPLE_POT, size: "100ml", price: 3000, qty: 1, colour: colourName });',
     'addToCart({ product: SAMPLE_POT, size: "100ml", qty: 1, colour: colourName });'],
    ['addToCart({ product: SAMPLE_BUNDLE, size: "5 pots", price: 15000, qty: 1, colour: null });',
     'addToCart({ product: SAMPLE_BUNDLE, size: "5 pots", qty: 1, colour: null });'],
    // totals and formatter
    ['const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);', ''],
    ['const fmtP = p => `UGX ${p.toLocaleString()}`;', ''],
    // cart drawer
    ['<p style={{ fontSize: 14, fontWeight: 600, color: B.coral, marginTop: 4 }}>{fmtP(item.price * item.qty)}</p>', ''],
    ['<span style={{ fontSize: 16, fontWeight: 600 }}>Total</span>',
     '<span style={{ fontSize: 16, fontWeight: 600 }}>Items in your list</span>'],
    ['<span style={{ fontSize: 20, fontWeight: 700, color: B.coral }}>{fmtP(cartTotal)}</span>',
     '<span style={{ fontSize: 20, fontWeight: 700, color: B.coral }}>{cartCount}</span>'],
    ['{cartTotal >= 200000 && <p style={{ fontSize: 13, color: B.teal, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><TruckIcon /> Free delivery included!</p>}',
     '<p style={{ fontSize: 13, color: "#777", marginBottom: 12, lineHeight: 1.5 }}>Submit your list and our sales team will send you a quotation.</p>'],
    ['>Proceed to Checkout</button>', '>Request a Quote</button>'],
    // doors + product grid
    ['<span>Grade 1 exterior matt. From {fmtP(weathershield.sizes[0].price)}</span>',
     '<span>Grade 1 premium exterior matt for tropical weather.</span>'],
    ['<span style={{ fontSize: 15, fontWeight: 700, color: B.coral }}>From {fmtP(p.sizes[0].price)}</span>',
     '<span style={{ fontSize: 13, fontWeight: 600, color: B.coral }}>View details</span>'],
  ],

  "src/pages/PaintCategoryPage.jsx": [
    ['const fmtP = p => `UGX ${p.toLocaleString()}`;', ''],
    ['<span style={{ fontSize: 15, fontWeight: 700, color: B.coral }}>From {fmtP(p.sizes[0].price)}</span>',
     '<span style={{ fontSize: 13, fontWeight: 600, color: B.coral }}>View details</span>'],
  ],

  "src/pages/ProductDetailPage.jsx": [
    ['const total = sz.price * qty;', ''],
    ['const fmtPrice = (p) => `UGX ${p.toLocaleString()}`;', ''],
    ['const item = { product, size: sz.size, price: sz.price, qty };',
     'const item = { product, size: sz.size, qty };'],
    ['<div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{fmtPrice(s.price)}</div>', ''],
    ['<div style={{ fontSize: 13, color: "#999" }}>{qty} × {sz.size} = {fmtPrice(total)}</div>',
     '<div style={{ fontSize: 13, color: "#999" }}>{qty} × {sz.size}</div>'],
    ['<div style={{ fontSize: 13, color: "#999", marginBottom: 2 }}>Total</div>',
     '<div style={{ fontSize: 13, color: "#999", marginBottom: 2 }}>Your selection</div>'],
    ['<div style={{ fontSize: 28, fontWeight: 700, color: B.black }}>{fmtPrice(total)}</div>',
     '<div style={{ fontSize: 22, fontWeight: 700, color: B.black }}>{qty} × {sz.size}</div>'],
    ['{total >= 200000 && <div style={{ display: "flex", alignItems: "center", gap: 6, color: B.teal, fontSize: 13, fontWeight: 600 }}><TruckIcon /> Free delivery</div>}', ''],
    ['<div style={{ fontSize: 14, marginBottom: 3 }}>From <strong>{fmtPrice(product.sizes[0].price)}</strong></div>', ''],
    ['<div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{fmtPrice(colourSz.price)} <span style={{ fontWeight: 400, fontSize: 12, color: "#999" }}>/ {colourSz.coverage}</span></div>',
     '<div style={{ fontSize: 13, color: "#777", marginBottom: 12 }}>Coverage: {colourSz.coverage}</div>'],
    ['const colourTotal = colourSz.price * colourQty;', ''],
    ['<div style={{ fontSize: 13, color: "#777", marginBottom: 10 }}>{colourQty} × {colourSz.size} = <strong style={{ color: B.coral }}>{fmtPrice(colourTotal)}</strong></div>',
     '<div style={{ fontSize: 13, color: "#777", marginBottom: 10 }}>{colourQty} × {colourSz.size}</div>'],
    ['onAddToCart({ product, size: colourSz.size, price: colourSz.price, qty: colourQty, colour: selectedColourName });',
     'onAddToCart({ product, size: colourSz.size, qty: colourQty, colour: selectedColourName });'],
    ['<span style={{ fontSize: 15, fontWeight: 700, color: B.coral }}>From {fmtPrice(r.sizes[0].price)}</span>',
     '<span style={{ fontSize: 13, fontWeight: 600, color: B.coral }}>View details</span>'],
  ],

  "src/pages/ColourDetailPage.jsx": [
    ['if (onAddToCart) onAddToCart({ product: selectedProd, size: sz.size, price: sz.price, qty: buyQty, colour: colour.name });',
     'if (onAddToCart) onAddToCart({ product: selectedProd, size: sz.size, qty: buyQty, colour: colour.name });'],
    ['<div style={{ fontSize: 13, color: B.coral, fontWeight: 700, marginBottom: 2 }}>Ksh {sz.price.toLocaleString()}</div>', ''],
    ['Total: <strong style={{ color: "#1a1a1a", fontSize: 15 }}>Ksh {(sz.price * buyQty).toLocaleString()}</strong>',
     'Selected: <strong style={{ color: "#1a1a1a", fontSize: 15 }}>{buyQty} × {sz.size}</strong>'],
    ['<span style={{ marginLeft: 10, color: "#bbb" }}>({buyQty} × Ksh {sz.price.toLocaleString()})</span>', ''],
    ['{prod.finish} &bull; {prod.category === "interior" ? "Interior" : "Exterior"}',
     '{prod.finish} &bull; {prod.category.charAt(0).toUpperCase() + prod.category.slice(1)}'],
  ],

  "src/pages/ColourCategoryPage.jsx": [
    ['Get 5 colour samples delivered to your door for just UGX 15,000',
     'Order colour samples to see your shade at home before you commit.'],
  ],
  "src/pages/StyleCategoryPage.jsx": [
    ['Get 5 colour samples delivered to your door for just UGX 15,000',
     'Order colour samples to see your shade at home before you commit.'],
  ],
  "src/pages/RoomInspirationPage.jsx": [
    ['{ n: "Free", l: "Colour Samples" }', '{ n: "Samples", l: "On Request" }'],
  ],
};

if (process.argv.includes("--dump")) { console.log(JSON.stringify(EDITS)); process.exit(0); }

const problems = [];
const contents = {};

// ---- read ----
const files = [...Object.keys(EDITS), "src/data/products.js"];
for (const f of files) {
  if (!fs.existsSync(f)) { problems.push(`Missing file ${f}`); continue; }
  contents[f] = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
}

// ---- products.js: strip price fields ----
let removedPrices = 0;
if (contents["src/data/products.js"] !== undefined) {
  contents["src/data/products.js"] = contents["src/data/products.js"].replace(/price:\s*\d+,\s*/g, () => { removedPrices++; return ""; });
  if (removedPrices < 40) problems.push(`Expected to remove 40+ price fields from src/data/products.js but removed ${removedPrices} (already done?)`);
}

// ---- exact-once edits ----
let editCount = 0;
for (const [f, edits] of Object.entries(EDITS)) {
  if (contents[f] === undefined) continue;
  for (const [find, repl] of edits) {
    const n = contents[f].split(find).length - 1;
    if (n !== 1) {
      problems.push(`${f}: expected 1 match, found ${n} for:\n      ${find.slice(0, 110)}${find.length > 110 ? "..." : ""}`);
      continue;
    }
    contents[f] = contents[f].replace(find, () => repl);
    editCount++;
  }
}

// ---- drop imports that are no longer used ----
const uses = (text, n) => new RegExp(`\\b${n}\\b`).test(text);
for (const f of Object.keys(contents)) {
  if (f.endsWith("products.js")) continue;
  const lines = contents[f].split("\n");
  const body = lines.filter(l => !l.startsWith("import ")).join("\n");
  const out = [];
  for (const l of lines) {
    const m = l.match(/^import \{ (.+) \} from "(\.[^"]+)";$/);
    if (m) {
      const names = m[1].split(",").map(s => s.trim()).filter(n => uses(body, n));
      if (names.length) out.push(`import { ${names.join(", ")} } from "${m[2]}";`);
      continue;
    }
    out.push(l);
  }
  contents[f] = out.join("\n").replace(/\n{3,}/g, "\n\n");
}

// ---- syntax check before writing ----
try {
  const esbuild = createRequire(path.resolve("package.json"))("esbuild");
  for (const [f, c] of Object.entries(contents)) {
    try { esbuild.transformSync(c, { loader: "jsx" }); }
    catch (e) { problems.push(`${f} would have a syntax error: ${String(e.message).split("\n")[0]}`); }
  }
} catch { console.log("(esbuild not found - skipped syntax check)"); }

if (problems.length) {
  console.error("\nStopped. Nothing was changed because of these problems:\n");
  problems.forEach(p => console.error("  - " + p));
  console.error("\nCopy this message and send it to Claude.");
  process.exit(1);
}

for (const [f, c] of Object.entries(contents)) fs.writeFileSync(f, c, "utf8");
console.log(`\nDone. ${removedPrices} price fields removed from products.js and ${editCount} edits applied.`);

// ---- scan for anything price-like that is left ----
const leftovers = [];
const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) { if (e.name !== "assets") walk(p); }
  else if (/\.(jsx?|css)$/.test(e.name)) {
    fs.readFileSync(p, "utf8").split("\n").forEach((l, i) => {
      if (/\bUGX\b|\bKsh\b|fmtP\b|fmtPrice|\.price\b|\bprice\b|\b\d+% off\b|[Dd]elivery/.test(l)) leftovers.push(`  ${p.replace(/\\/g, "/")}:${i + 1}  ${l.trim().slice(0, 100)}`);
    });
  }
});
walk("src");
if (leftovers.length) {
  console.log("\nStill mentions price or delivery (check these by hand):\n" + leftovers.join("\n"));
} else {
  console.log("\nNo price or delivery wording left in src/.");
}
console.log("\nNext: run  npm run dev  and check the cart, a product page, the colour pop-up and the home page.");
console.log("Undo anytime with:  git checkout .");
