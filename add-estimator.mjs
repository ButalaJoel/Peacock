// Adds the Paint Estimator page (#/estimator), built on the catalogue's coverage figures.
// Run from the project root:  node add-estimator.mjs
//
// Creates   src/pages/EstimatorPage.jsx        the page (choose product, area, coats -> litres/kits and packs)
//           src/utils/estimate.js              the calculations (plain functions, easy to test)
//           src/data/estimatorProducts.js      coverage per product, taken from the catalogue
//           src/data/priceList.js              empty: prices for the estimator ONLY, filled later from the price list
//           src/config/features.js             estimatedPrices switch (off)
// Edits     PageSwitch.jsx (adds the route), Header.jsx / MobileMenu.jsx / navData.js (adds "Paint Estimator" under Advice)
// Every edit must match exactly once, otherwise nothing is changed.   Undo: git checkout . ; git clean -fd src

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const NEW_FILES = {
  "src/utils/estimate.js": String.raw`// Pure estimating functions (no React) so they can be tested on their own.

const round1 = n => Math.round(n * 10) / 10;

// "1L" -> 1, "4L" -> 4, "20L" -> 20, "½L" -> 0.5. Anything else (kg, kits) -> null.
export function packLitres(size) {
  const m = String(size).trim().match(/^(½|\d+(?:\.\d+)?)\s*L$/i);
  if (!m) return null;
  return m[1] === "½" ? 0.5 : Number(m[1]);
}

// Cheapest way to reach at least "needed" litres with the given pack sizes:
// least total litres first, then fewest packs. packs = [{ size, litres }]
export function chooseLitrePacks(needed, packs) {
  if (!(needed > 0) || packs.length === 0) return null;
  const unit = 0.5; // every catalogue pack is a multiple of half a litre
  const sizes = packs.map(p => ({ ...p, u: Math.round(p.litres / unit) }));
  const target = Math.ceil(needed / unit - 1e-9);
  const limit = target + Math.max(...sizes.map(s => s.u));
  const best = new Array(limit + 1).fill(Infinity);
  const from = new Array(limit + 1).fill(null);
  best[0] = 0;
  for (let i = 1; i <= limit; i++) {
    for (const s of sizes) {
      if (i >= s.u && best[i - s.u] + 1 < best[i]) { best[i] = best[i - s.u] + 1; from[i] = s; }
    }
  }
  let total = -1;
  for (let i = target; i <= limit; i++) if (best[i] < Infinity) { total = i; break; }
  if (total < 0) return null;
  const counts = {};
  for (let i = total; i > 0; i = i - from[i].u) counts[from[i].size] = (counts[from[i].size] || 0) + 1;
  const items = Object.entries(counts).map(([size, qty]) => ({ size, qty, litres: sizes.find(s => s.size === size).litres }))
    .sort((a, b) => b.litres - a.litres);
  return { items, totalLitres: total * unit };
}

export function areaFromRectangle(length, width) {
  const a = Number(length) * Number(width);
  return a > 0 ? a : 0;
}

export function areaFromWalls(totalWallLength, height, openings) {
  const a = Number(totalWallLength) * Number(height) - (Number(openings) || 0);
  return a > 0 ? a : 0;
}

// product: entry from PRODUCTS (needs packSizes). config: entry from ESTIMATOR_PRODUCTS.
// options: { area (m2), coats, variantIndex }
export function estimate(product, config, { area, coats, variantIndex = 0 }) {
  if (!config || !(area > 0) || !(coats > 0)) return null;
  const work = area * coats;
  if (config.needsReview) return { needsReview: true };

  if (config.kit) {
    const [low, high] = config.kit.coverage;
    const kitsFewest = Math.ceil(work / high - 1e-9);
    const kitsRecommended = Math.ceil(work / low - 1e-9);
    return {
      type: "kit", area, coats, work,
      kitsFewest, kitsRecommended,
      items: [{ size: config.kit.size, qty: kitsRecommended }],
      assumption: "Each kit (" + config.kit.size + ") covers " + low + "-" + high + " sq m per coat as stated in the catalogue. The recommended quantity uses the lower figure so you do not run short.",
    };
  }

  const variant = config.variants ? config.variants[variantIndex] : null;
  const [low, high] = (variant || config).perLitre;
  const litresFewest = round1(work / high);
  const litresRecommended = round1(work / low);
  const packs = product.packSizes.map(size => ({ size, litres: packLitres(size) })).filter(p => p.litres);
  const choice = chooseLitrePacks(work / low, packs);
  return {
    type: "litres", area, coats, work,
    litresFewest, litresRecommended,
    items: choice ? choice.items.map(i => ({ size: i.size, qty: i.qty })) : [],
    packLitres: choice ? choice.totalLitres : null,
    assumption: "One litre covers " + (low === high ? low : low + "-" + high) + " sq m per coat" + (variant ? " (" + variant.label + ")" : "") + ", as stated in the catalogue. The recommended quantity uses the lower figure so you do not run short.",
  };
}
`,
  "src/data/estimatorProducts.js": String.raw`// Products the paint estimator can calculate, with coverage taken from the catalogue (CATALOGUE_2026.pdf).
// perLitre: [fewest, most] square metres covered by one litre, exactly as printed in the catalogue.
// The page also shows the catalogue's own coverage text (product.coverage) next to every result.
// Products that are not listed here (kilogram-based, no coverage given, or unclear) are not estimated:
// the estimator tells the visitor to ask our sales team instead of guessing.
//
// kit: for two-part products sold as one kit. coverage = [fewest, most] square metres per kit.
// variants: the catalogue gives different figures for different surfaces or film thicknesses.
// needsReview: the figure is under technical review, so the estimator shows no numbers yet.
export const ESTIMATOR_PRODUCTS = {
  // Decorative
  "vinyl-silk-makula": { perLitre: [10, 12] },
  "weathershield-plus": { perLitre: [12, 12] },
  "premium-matt": { perLitre: [10, 10] },
  "super-matt-emulsion": { perLitre: [8, 10] },
  "gloss-emulsion": { perLitre: [10, 12] },
  "standard-emulsion": { perLitre: [3, 3.75], note: "Catalogue: 4L covers 12-15 Sqm." },
  "undercoat-emulsion": { perLitre: [2, 3], note: "Catalogue figure is for fresh smooth wall screed plaster." },
  "flat-emulsion": { variants: [
    { label: "Fresh smooth wall screed plaster", perLitre: [2, 3] },
    { label: "Roughcast", perLitre: [1, 1.5] },
  ] },
  "floxy-tile-coating": { perLitre: [4, 4], note: "Catalogue figure is for 1 coat." },
  "latex-primer-sealer": { perLitre: [8, 9], note: "Catalogue: 4L covers 32-36 Sqm." },
  "plaster-primer": { perLitre: [3.6, 3.6], note: "Catalogue figure is for fresh smooth plaster." },
  "acrylic-elastomeric-coating": { perLitre: [4, 4] },
  "pearl-coat": { perLitre: [5, 6], note: "The catalogue says variations should be expected." },
  "acrylic-art-pallet": { perLitre: [4.6, 4.6] },
  "glaze-coat": { perLitre: [4.6, 4.6] },

  // Industrial
  "fast-dry-enamel": { perLitre: [8, 8] },
  "cellulose-enamel": { perLitre: [7, 7] },
  "epoxy-2k-enamel": { kit: { size: "Base 3L + Hardener 1L", coverage: [32, 40] }, note: "Catalogue: 4L covers 32-40 Sqm, depending on the surface." },
  "floxy-multipurpose-sealer": { perLitre: [6, 6] },
  "floxy-st-primer": { perLitre: [6, 6], note: "Catalogue figure is at 0.2mm thickness and depends on the surface." },
  "floxy-high-temperature-resistant-coating": { variants: [
    { label: "125 micron film", perLitre: [5.6, 5.6] },
    { label: "250 micron film", perLitre: [2.8, 2.8] },
  ] },
  "road-marking-paint": { perLitre: [6, 6] },
  "super-gloss": { perLitre: [5, 6], note: "Catalogue: 4L covers 20-24 Sqm." },
  "standard-hi-gloss": { perLitre: [2.5, 3], note: "Catalogue: 4L covers 10-12 Sqm." },
  "rd-enamel": { perLitre: [9, 10] },
  "undercoat-oil": { perLitre: [5, 5] },
  "concrete-sealer": { perLitre: [6.5, 6.5] },
  "bituminous-emulsion": { perLitre: [2, 3], note: "Depends on the texture of the surface." },
  "m-basecoat-aluminium": { perLitre: [8, 8] },
  // Under technical review: the catalogue (1L covers 4 Sqm) differs from the earlier prototype (3L kit covers 4 Sqm).
  "epoxy-self-levelling": { perLitre: [4, 4], needsReview: true },

  // Wood care
  "nc-sanding-sealer": { perLitre: [4, 6] },
  "premium-lacquer": { perLitre: [6, 10] },
  "clear-varnish": { perLitre: [7, 7.5], note: "Catalogue: 4L covers 28-30 Sqm." },
  "1k-polyurethane-varnish": { perLitre: [7, 7.5], note: "Catalogue: 4L covers 28-30 Sqm." },
};
`,
  "src/data/priceList.js": String.raw`// Prices for the paint estimator ONLY (nothing else on the site shows prices).
// Fill this from the company price list, then set FEATURES.estimatedPrices to true in src/config/features.js.
// Format: product id -> pack size -> price in UGX. The size text must match the pack sizes in the catalogue data.
// Example:  "vinyl-silk-makula": { "4L": 100000, "20L": 450000 },
// Prices change over time, so the estimator always shows them as estimates.
export const PRICE_LIST = {};
`,
  "src/config/features.js": String.raw`// Feature switches.
// estimatedPrices: show an "estimated cost" in the paint estimator. Keep it false until the company has
// approved showing prices and src/data/priceList.js has been filled from the official price list.
export const FEATURES = {
  estimatedPrices: false,
};
`,
  "src/pages/EstimatorPage.jsx": String.raw`import { useState } from "react";
import { useApp } from "../context/useApp.js";
import { B } from "../data/theme.js";
import { PRODUCTS, CATEGORIES } from "../data/products.js";
import { ESTIMATOR_PRODUCTS } from "../data/estimatorProducts.js";
import { PRICE_LIST } from "../data/priceList.js";
import { FEATURES } from "../config/features.js";
import { estimate, areaFromRectangle, areaFromWalls } from "../utils/estimate.js";

const OPTIONS = PRODUCTS.filter(p => ESTIMATOR_PRODUCTS[p.id]);
const GROUPS = Object.entries(CATEGORIES)
  .map(([id, c]) => ({ id, label: c.label, items: OPTIONS.filter(p => p.category === id) }))
  .filter(g => g.items.length > 0);

const card = { background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 28 };
const label = { fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#777", display: "block", marginBottom: 8 };
const pill = active => ({
  padding: "9px 16px", borderRadius: 24, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  border: "2px solid " + (active ? B.coral : "#ddd"), background: active ? B.coral : "#fff", color: active ? "#fff" : "#555",
});
const money = n => "UGX " + Math.round(n).toLocaleString();

function NumberField({ value, onChange, unit, placeholder }) {
  return (
    <div style={{ position: "relative" }}>
      <input className="si" type="number" min="0" step="0.1" value={value} placeholder={placeholder || "0"} onChange={e => onChange(e.target.value)} style={{ paddingRight: 48 }} />
      <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: 14 }}>{unit}</span>
    </div>
  );
}

export default function EstimatorPage() {
  const { addToCart, setCartOpen, setQuoteOpen, openProduct } = useApp();
  const [productId, setProductId] = useState(OPTIONS.length ? OPTIONS[0].id : "");
  const [variantIndex, setVariantIndex] = useState(0);
  const [mode, setMode] = useState("area");
  const [areaInput, setAreaInput] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [wallLength, setWallLength] = useState("");
  const [height, setHeight] = useState("");
  const [openings, setOpenings] = useState("");
  const [coats, setCoats] = useState(2);
  const [added, setAdded] = useState(false);

  const product = PRODUCTS.find(p => p.id === productId);
  const config = ESTIMATOR_PRODUCTS[productId];
  if (!product || !config) return null;

  const area = mode === "area" ? Number(areaInput) || 0
    : mode === "rectangle" ? areaFromRectangle(length, width)
    : areaFromWalls(wallLength, height, openings);
  const result = estimate(product, config, { area, coats, variantIndex });

  const changeProduct = e => { setProductId(e.target.value); setVariantIndex(0); setAdded(false); };
  const addItems = () => { result.items.forEach(it => addToCart({ product, size: it.size, qty: it.qty })); setAdded(true); };

  let cost = null;
  if (FEATURES.estimatedPrices && result && result.items && PRICE_LIST[product.id]) {
    const lines = result.items.map(it => (PRICE_LIST[product.id][it.size] || 0) * it.qty);
    if (result.items.every(it => PRICE_LIST[product.id][it.size])) cost = lines.reduce((a, b) => a + b, 0);
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 70px" }}>
      <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, color: B.coral, fontWeight: 700, marginBottom: 10 }}>Paint estimator</p>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 600, marginBottom: 12 }}>Estimate how much you need</h1>
      <p style={{ fontSize: 16, color: "#666", maxWidth: 640, lineHeight: 1.7, marginBottom: 32 }}>
        Choose a product, tell us the area, and we calculate the quantity using the coverage in the Peacock Paints catalogue.
      </p>

      <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>
        <div style={card}>
          <div style={{ marginBottom: 22 }}>
            <label style={label}>1. Product</label>
            <select className="si" value={productId} onChange={changeProduct}>
              {GROUPS.map(g => (
                <optgroup key={g.id} label={g.label}>
                  {g.items.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </optgroup>
              ))}
            </select>
            <p style={{ fontSize: 12, color: "#888", marginTop: 8, lineHeight: 1.6 }}>
              Catalogue coverage: {product.coverage}{config.note ? " " + config.note : ""}
            </p>
            {config.variants && (
              <div style={{ marginTop: 12 }}>
                <label style={label}>Surface or film thickness</label>
                <select className="si" value={variantIndex} onChange={e => setVariantIndex(Number(e.target.value))}>
                  {config.variants.map((v, i) => <option key={v.label} value={i}>{v.label}</option>)}
                </select>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={label}>2. Area to cover</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <button style={pill(mode === "area")} onClick={() => setMode("area")}>I know the area</button>
              <button style={pill(mode === "rectangle")} onClick={() => setMode("rectangle")}>Floor or ceiling</button>
              <button style={pill(mode === "walls")} onClick={() => setMode("walls")}>Walls</button>
            </div>
            {mode === "area" && <NumberField value={areaInput} onChange={setAreaInput} unit="m²" placeholder="Area" />}
            {mode === "rectangle" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <NumberField value={length} onChange={setLength} unit="m" placeholder="Length" />
                <NumberField value={width} onChange={setWidth} unit="m" placeholder="Width" />
              </div>
            )}
            {mode === "walls" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <NumberField value={wallLength} onChange={setWallLength} unit="m" placeholder="Total wall length" />
                <NumberField value={height} onChange={setHeight} unit="m" placeholder="Wall height" />
                <div style={{ gridColumn: "1 / -1" }}><NumberField value={openings} onChange={setOpenings} unit="m²" placeholder="Doors and windows (optional)" /></div>
              </div>
            )}
            {area > 0 && <p style={{ fontSize: 13, color: "#555", marginTop: 10 }}>Area to cover: <strong>{Math.round(area * 10) / 10} m²</strong></p>}
          </div>

          <div>
            <label style={label}>3. Number of coats</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3].map(n => <button key={n} style={pill(coats === n)} onClick={() => setCoats(n)}>{n}</button>)}
            </div>
            <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>Check the product guidance for how many coats your surface needs.</p>
          </div>
        </div>

        <div style={card}>
          {!result && (
            <div style={{ textAlign: "center", padding: "40px 10px", color: "#888" }}>
              <div style={{ fontSize: 40, color: B.coral, marginBottom: 8 }}>+</div>
              <h2 style={{ fontSize: 20, color: "#333", marginBottom: 8 }}>Your estimate</h2>
              <p style={{ fontSize: 14, lineHeight: 1.6 }}>Enter the area to see how much you need.</p>
            </div>
          )}

          {result && result.needsReview && (
            <div>
              <p style={label}>Estimate</p>
              <h2 style={{ fontSize: 22, marginBottom: 12 }}>We are confirming this one</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 20 }}>
                The coverage for {product.name} depends on the thickness you apply, so our team is checking it before we show a number. Request a quote and our sales team will work out the quantity with you.
              </p>
              <button className="btn bp" onClick={() => { addToCart({ product, size: product.packSizes[0], qty: 1 }); setQuoteOpen(true); }}>Request a quote</button>
            </div>
          )}

          {result && !result.needsReview && (
            <div>
              <p style={label}>Estimate for {product.name}</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 600, marginBottom: 4 }}>
                {result.type === "kit"
                  ? (result.kitsFewest === result.kitsRecommended ? result.kitsRecommended : result.kitsFewest + " to " + result.kitsRecommended) + (result.kitsRecommended === 1 ? " kit" : " kits")
                  : (result.litresFewest === result.litresRecommended ? result.litresRecommended : result.litresFewest + " to " + result.litresRecommended) + " litres"}
              </h2>
              <p style={{ fontSize: 14, color: "#777", marginBottom: 20 }}>
                For {Math.round(result.area * 10) / 10} m², {result.coats} {result.coats === 1 ? "coat" : "coats"}
              </p>

              <div style={{ background: "#faf8f5", borderRadius: 10, padding: "16px 18px", marginBottom: 18 }}>
                <p style={{ ...label, marginBottom: 10 }}>Recommended packs</p>
                {result.items.length === 0 ? (
                  <p style={{ fontSize: 14, color: "#666" }}>Ask our sales team which packs suit this quantity.</p>
                ) : result.items.map(it => (
                  <div key={it.size} style={{ display: "flex", justifyContent: "space-between", fontSize: 15, padding: "5px 0" }}>
                    <span>{it.size}</span><strong>x {it.qty}</strong>
                  </div>
                ))}
                {result.type === "litres" && result.packLitres ? <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>Total in packs: {result.packLitres} litres</p> : null}
              </div>

              {cost !== null && (
                <div style={{ marginBottom: 18 }}>
                  <p style={label}>Estimated cost</p>
                  <strong style={{ fontSize: 22, color: B.coral }}>{money(cost)}</strong>
                  <p style={{ fontSize: 12, color: "#888", marginTop: 6, lineHeight: 1.6 }}>Prices change over time and are not fixed. This figure is for estimation only. Confirm the current price with our sales team.</p>
                </div>
              )}

              <p style={{ fontSize: 12, color: "#777", lineHeight: 1.7, marginBottom: 6 }}><strong>How we calculated this:</strong> {result.assumption}</p>
              <p style={{ fontSize: 12, color: "#777", lineHeight: 1.7, marginBottom: 20 }}>
                This is an estimate, not a guarantee. Actual use depends on the surface condition, preparation, application method and conditions.
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn bp" onClick={() => { addItems(); setQuoteOpen(true); }}>Request a quote</button>
                <button className="btn bd" onClick={() => { addItems(); setCartOpen(true); }}>Add to quote list</button>
              </div>
              {added && <p style={{ fontSize: 13, color: B.tealDk, marginTop: 12 }}>Added to your quote list.</p>}
              <p style={{ marginTop: 16 }}>
                <button onClick={() => openProduct(product)} style={{ background: "none", border: "none", color: B.coral, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit", fontSize: 14 }}>View {product.name} →</button>
              </p>
            </div>
          )}
        </div>
      </div>

      <p style={{ fontSize: 13, color: "#888", marginTop: 28, lineHeight: 1.7, maxWidth: 760 }}>
        Not every product can be calculated here yet. For anything not listed, such as putties, stuccos, powders and two-part waterproofing systems, request a quote and our sales team will work out the quantity with you.
      </p>
    </div>
  );
}
`
};

const EDITS = {
  "src/pages/PageSwitch.jsx": [
    ["p", 'import EstimatorPage from "./EstimatorPage.jsx";'],
    ["x", "{CATEGORY_PAGES[pg] ? (", '{pg === "estimator" ? (\n        <EstimatorPage />\n      ) : CATEGORY_PAGES[pg] ? ('],
  ],
  "src/components/layout/Header.jsx": [
    ["x", '"Thinners & Solvents": "thinners-solvents"}', '"Thinners & Solvents": "thinners-solvents", "Paint Estimator": "estimator"}'],
  ],
  "src/components/layout/MobileMenu.jsx": [
    ["x", '"Thinners & Solvents": "thinners-solvents"}', '"Thinners & Solvents": "thinners-solvents", "Paint Estimator": "estimator"}'],
  ],
  "src/data/navData.js": [
    ["x", '{ title: "Decorating Advice", links: ["How To Tips","Supplies & Primers","Colour Chart"] },',
          '{ title: "Decorating Advice", links: ["Paint Estimator","How To Tips","Supplies & Primers","Colour Chart"] },'],
  ],
};

const problems = [];
const contents = {};
for (const f of Object.keys(EDITS)) {
  if (!fs.existsSync(f)) { problems.push(`Missing ${f}`); continue; }
  contents[f] = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
}
if (fs.existsSync("src/pages/EstimatorPage.jsx")) problems.push("src/pages/EstimatorPage.jsx already exists - this step looks done");

let count = 0;
for (const [f, edits] of Object.entries(EDITS)) {
  if (contents[f] === undefined) continue;
  for (const e of edits) {
    if (e[0] === "p") { contents[f] = e[1] + "\n" + contents[f]; count++; continue; }
    const n = contents[f].split(e[1]).length - 1;
    if (n !== 1) { problems.push(`${f}: expected 1 match, found ${n} for: ${e[1].slice(0, 90)}`); continue; }
    contents[f] = contents[f].replace(e[1], () => e[2]); count++;
  }
}

const all = { ...contents, ...NEW_FILES };
try {
  const esbuild = createRequire(path.resolve("package.json"))("esbuild");
  for (const [f, c] of Object.entries(all)) {
    try { esbuild.transformSync(c, { loader: "jsx" }); } catch (e) { problems.push(`${f} would have a syntax error: ${String(e.message).split("\n")[0]}`); }
  }
} catch { console.log("(esbuild not found - skipped syntax check)"); }

if (problems.length) {
  console.error("\nStopped. Nothing was changed because of these problems:\n");
  problems.forEach(p => console.error("  - " + p));
  console.error("\nCopy this message and send it to Claude.");
  process.exit(1);
}
for (const [f, c] of Object.entries(all)) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, c, "utf8"); }

console.log(`\nDone. ${count} edits applied, ${Object.keys(NEW_FILES).length} files created:`);
Object.keys(NEW_FILES).forEach(f => console.log("  " + f));
console.log("\nTry it: npm run dev, then Advice -> Paint Estimator (or open #/estimator).");
console.log("Undo anytime with:  git checkout . ; git clean -fd src");
