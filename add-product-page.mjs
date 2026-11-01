// Rebuilds the product page as drawn: image + size thumbnails on the left; title, size pills, one action row
// and a 3x2 facts grid on the right; tabs (Description / Before you start / Product sheet) underneath.
// Run from the project root:  node add-product-page.mjs
//
// KEPT exactly as they are: the colour picker section ("Select colour and size"), the related products row,
// and all the page's state (size, quantity, colour, add to cart).
// NEW:  src/data/checklists.js  (the "Before you start" content, taken from the catalogue's preparation guides)
// Rewritten: src/pages/ProductDetailPage.jsx      Edited: PageSwitch.jsx (reset the page per product), global.css
// Checks first; if anything does not match, NOTHING is changed.   Undo: git checkout . ; git clean -fd src

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const PAGE = "src/pages/ProductDetailPage.jsx";
const SWITCH = "src/pages/PageSwitch.jsx";
const CSS = "src/styles/global.css";

const CHECKLISTS_JS = String.raw`// "Before you start" content for the product pages.
// Everything here comes from the Peacock Paints catalogue (surface preparation and primer guides).
// Where the catalogue says nothing about a product, the page tells the visitor to ask the sales team.
// Needs technical review before launch.

export const GENERAL_STEPS = [
  { label: "Sand", text: "Removes loose material such as dirt, dust and powder from the surface." },
  { label: "Scrape", text: "Removes flaky and loose material. Painting can never be done on top of flaky or loose paint." },
  { label: "Etch", text: "For very smooth surfaces such as iron sheets, metal plates and mortar floors. The etching material roughens the surface so the next coats can stick." },
  { label: "Repair masonry", text: "Some surfaces need masonry work: loose plaster may have to be redone with fresh plaster." },
  { label: "Treat dampness", text: "Moisture in the surface should be below 15%, checked with a moisture meter. Use the recommended sealers and primers, such as Concrete Sealer." },
  { label: "De-grease", text: "Special solvents remove grease and oily material that would stop later coats from sticking." },
];

export const PRIMER_GUIDE = [
  { surface: "Bare wood", primer: "Peacock SB Stain Sealer" },
  { surface: "Concrete or masonry", primer: "Peacock Alkali-resistant Primer or SB Stain Sealer" },
  { surface: "Metal", primer: "Rust-inhibiting Peacock Etch Primer" },
  { surface: "Drywall", primer: "Latex Primer Sealer" },
  { surface: "Glossy surfaces", primer: "Peacock WB Bond Aid" },
  { surface: "Previously painted, stable surfaces", primer: "Latex Primer Sealer (if the surface is in good condition)" },
  { surface: "Damp floors or difficult-to-prepare surfaces", primer: "Peacock Floxy ST Primer" },
];

export const WOOD_STEPS = [
  { label: "Inspect", text: "Check for dirt, grease, mildew, flaking paint, rot or loose fixtures." },
  { label: "Clean", text: "Use soap and water indoors, or wood cleaner or a bleach solution outdoors. Let it dry." },
  { label: "Remove old finishes", text: "Strip or sand flaking paint or varnish." },
  { label: "Sand", text: "Use medium to fine sandpaper, in the direction of the wood grain." },
  { label: "Repair", text: "Fill cracks or holes with interior or exterior grade wood filler. Sand smooth." },
  { label: "Prime if needed", text: "Use NC wood primer for bare wood, high-tannin wood, or when changing paint types." },
  { label: "Check conditions", text: "The wood must be dry (below 15% moisture). Avoid high humidity or direct sun." },
];

export const WOOD_TIPS = [
  { label: "Interior wood", text: "Use a low odour finish for a smooth result, with good ventilation." },
  { label: "Exterior wood", text: "Use urethane oil varnish. Seal joints and end grains, and recoat regularly." },
];

export const WOOD_FINAL = [
  { label: "Surface inspected and cleaned" },
  { label: "Old paint or varnish removed" },
  { label: "Surface sanded and dust-free" },
  { label: "Cracks and holes repaired" },
  { label: "Primer applied (if needed)" },
  { label: "Substrate dry" },
  { label: "Sanding sealer (1K or 2K) selected" },
  { label: "Correct paint or stain chosen" },
];

// Returns null when there is nothing in the catalogue for this product (for example thinners).
export function checklistFor(product) {
  if (product.category === "woodcare") {
    return {
      kind: "wood",
      intro: "Wood care paints work best on a clean, dry, sound surface. Tick each item off as you go.",
      steps: WOOD_STEPS,
      tips: WOOD_TIPS,
      tickItems: WOOD_FINAL,
      source: "Peacock Paints catalogue: Surface Preparation for Wood Care Paints",
    };
  }
  const paint = product.category === "decorative" || product.category === "industrial";
  if (paint && !product.subcategories.includes("other")) {
    return {
      kind: "general",
      intro: "A strong, stable surface comes first. Tick each step off as you go.",
      steps: null,
      tips: null,
      tickItems: GENERAL_STEPS,
      primers: PRIMER_GUIDE,
      damp: product.category === "industrial" && product.subcategories.includes("general"),
      source: "Peacock Paints catalogue: Surface Preparation Checklist and How to Choose a Primer",
    };
  }
  return null;
}
`;

const CSS_ADD = `
/* Product page */
.pp-facts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.pp-pill { transition: border-color .2s, background .2s; }
.pp-pill:hover { border-color: #E8603C !important; }
@media (max-width: 900px) { .pp-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 768px) {
  .pp-actions { position: sticky; bottom: 0; z-index: 30; background: #fff; padding: 12px 0; box-shadow: 0 -6px 18px rgba(0,0,0,.08); }
}
`;

const PAGE_BODY = String.raw`  const mainImg = activeImg || (product.imgBySize && product.imgBySize[sz.size]) || product.img;
  const thumbs = Array.from(new Set([product.img].concat(Object.values(product.imgBySize || {}), product.gallery || []).filter(Boolean)));
  const cat = CATEGORIES[product.category];
  const subLabel = cat && product.subcategories.length ? (cat.subcategories.find(s => s.id === product.subcategories[0]) || {}).label : null;
  const facts = [
    { label: (product.mixing && product.mixing.label) || "Mix", value: product.mixing && product.mixing.value },
    { label: "Application", value: product.application },
    { label: "Coverage", value: product.coverage },
    { label: "Drying time", value: product.dryTime },
    { label: "Pack sizes", value: product.packSizes.join(", ") },
    { label: "Colour systems", value: product.colourSystems.join(", ") },
  ].filter(f => f.value);
  const tabs = [{ id: "description", label: "Description" }]
    .concat(checklist ? [{ id: "checklist", label: "Before you start" }] : [])
    .concat([{ id: "sheet", label: "Product sheet" }]);
  const ticked = checklist ? checklist.tickItems.filter(it => checked[it.label]).length : 0;
  const colourChip = selectedColourName ? trendingColours.find(c => c.name === selectedColourName) : null;
  const pillStyle = active => ({
    padding: "7px 18px", borderRadius: 20, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
    border: "1.5px solid " + (active ? B.coral : "#ddd"), background: active ? B.coral + "12" : "#fff", color: active ? B.coral : "#333",
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px 6px" }}>
        <div style={{ display: "flex", gap: 8, fontSize: 13, color: "#999", flexWrap: "wrap" }}>
          <span onClick={onBack} style={{ color: B.coral, cursor: "pointer" }}>Home</span>
          <span>/</span><span>Products</span><span>/</span>
          <span>{cat ? cat.label : product.category}</span><span>/</span>
          <span style={{ color: "#333" }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 24px 60px" }}>
        <div className="g2" style={{ display: "grid", gridTemplateColumns: "5fr 6fr", gap: 40, alignItems: "start" }}>

          {/* Left: mockup and thumbnails */}
          <div>
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, height: 380, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {mainImg
                ? <img src={mainImg} alt={product.name} style={{ maxHeight: 340, maxWidth: "88%", objectFit: "contain" }} />
                : <span style={{ fontSize: 13, color: "#bbb" }}>Image coming soon</span>}
              {product.tag && <span style={{ position: "absolute", top: 14, left: 14, background: B.coral, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>{product.tag}</span>}
            </div>
            {thumbs.length > 1 && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {thumbs.map(src => (
                  <button key={src} onClick={() => setActiveImg(src)} aria-label="Show this picture"
                    style={{ width: 64, height: 64, padding: 4, borderRadius: 10, background: "#fff", cursor: "pointer", border: "1.5px solid " + (mainImg === src ? B.coral : "#e5e5e5") }}>
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: details and buy box */}
          <div>
            <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: B.coral, fontWeight: 600, marginBottom: 6 }}>
              {cat ? cat.label : product.category}{subLabel ? " · " + subLabel : ""}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>{product.name}</h1>
            {product.subtitle && <p style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>{product.subtitle}</p>}
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#555", marginBottom: 18 }}>{product.desc}</p>

            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#333", marginBottom: 8 }}>Size</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {product.sizes.map((s, i) => (
                <button key={s.size} className="pp-pill" style={pillStyle(selectedSize === i)} onClick={() => { setSelectedSize(i); setQty(1); setActiveImg(null); }}>{s.size}</button>
              ))}
            </div>

            <div className="pp-actions" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #ddd", borderRadius: 22, height: 42, flexShrink: 0 }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Fewer" style={{ width: 36, height: 40, border: "none", background: "none", cursor: qty <= 1 ? "default" : "pointer", color: qty <= 1 ? "#ccc" : "#333", display: "flex", alignItems: "center", justifyContent: "center" }}><MinusIcon /></button>
                <span style={{ minWidth: 26, textAlign: "center", fontSize: 15, fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(Math.min(50, qty + 1))} aria-label="More" style={{ width: 36, height: 40, border: "none", background: "none", cursor: "pointer", color: "#333", display: "flex", alignItems: "center", justifyContent: "center" }}><PlusIcon /></button>
              </div>
              <button onClick={handleAdd} style={{ flex: "1 1 150px", height: 42, borderRadius: 22, border: "none", background: addedAnim ? B.teal : B.coral, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background .3s" }}>
                {addedAnim ? <><CheckIcon /> Added</> : <><CartIcon /> Add to cart</>}
              </button>
              {product.colourSystems.length > 0 && (
                <button onClick={() => colourSectionRef.current && colourSectionRef.current.scrollIntoView({ behavior: "smooth" })} className="pp-pill"
                  style={{ height: 42, borderRadius: 22, border: "1.5px solid " + B.coral, background: "#fff", color: B.coral, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "0 18px", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                  <PaletteIcon /> {selectedColourName ? "Change colour" : "Select colour"}
                </button>
              )}
            </div>

            {colourChip && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 6px", border: "1px solid #e5e5e5", borderRadius: 20, fontSize: 13, marginBottom: 14 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: colourChip.color, border: "1px solid rgba(0,0,0,.12)" }} />
                {selectedColourName}
                <button onClick={() => setSelectedColourName(null)} aria-label="Remove colour" style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            )}

            {facts.length > 0 && (
              <div className="pp-facts" style={{ marginTop: 8 }}>
                {facts.map(f => (
                  <div key={f.label} style={{ background: "#faf8f5", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#222", marginBottom: 3 }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: "#555", lineHeight: 1.45 }}>{f.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: 28, background: "#fff", border: "1px solid #eee", borderRadius: 14 }}>
          <div style={{ display: "flex", gap: 22, padding: "0 22px", borderBottom: "1px solid #eee", overflowX: "auto" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ background: "none", border: "none", borderBottom: "3px solid " + (tab === t.id ? B.coral : "transparent"), padding: "14px 0 11px", fontSize: 14, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? "#111" : "#777", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "20px 22px 24px" }}>
            {tab === "description" && (
              <div>{product.longDesc.split("\n\n").map((p, i) => (<p key={i} style={{ fontSize: 14.5, lineHeight: 1.8, color: "#555", marginBottom: 12, maxWidth: 820 }}>{p}</p>))}</div>
            )}

            {tab === "checklist" && checklist && (
              <div>
                <p style={{ fontSize: 14, color: "#555", marginBottom: 14, lineHeight: 1.6 }}>{checklist.intro}</p>
                {checklist.damp && (
                  <p style={{ fontSize: 13.5, color: "#7a4a10", background: "#fff6e5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, lineHeight: 1.6 }}>
                    Coatings such as epoxy are sensitive to dampness and to the condition of the surface. Check both before you start.
                  </p>
                )}
                {checklist.steps && (
                  <ol style={{ margin: "0 0 18px 18px", fontSize: 14, color: "#555", lineHeight: 1.7 }}>
                    {checklist.steps.map(s => <li key={s.label}><strong>{s.label}</strong> - {s.text}</li>)}
                  </ol>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px 32px" }}>
                  {checklist.tickItems.map(it => (
                    <label key={it.label} style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", fontSize: 14, lineHeight: 1.55, color: "#444" }}>
                      <input type="checkbox" checked={!!checked[it.label]} onChange={() => setChecked(c => ({ ...c, [it.label]: !c[it.label] }))} style={{ marginTop: 4, accentColor: B.coral }} />
                      <span><strong>{it.label}</strong>{it.text ? " - " + it.text : ""}</span>
                    </label>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: ticked === checklist.tickItems.length ? B.tealDk : "#888", marginTop: 14, fontWeight: 600 }}>
                  {ticked} of {checklist.tickItems.length} done
                </p>

                {checklist.tips && (
                  <div style={{ marginTop: 18 }}>
                    {checklist.tips.map(t => <p key={t.label} style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}><strong>{t.label}:</strong> {t.text}</p>)}
                  </div>
                )}

                {checklist.primers && (
                  <div style={{ marginTop: 22 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#333", marginBottom: 10 }}>Choose the right primer</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "8px 32px" }}>
                      {checklist.primers.map(p => (
                        <div key={p.surface} style={{ fontSize: 13.5, color: "#555", lineHeight: 1.55 }}><strong style={{ color: "#222" }}>{p.surface}:</strong> {p.primer}</div>
                      ))}
                    </div>
                  </div>
                )}

                <p style={{ fontSize: 12, color: "#999", marginTop: 20, lineHeight: 1.6 }}>Source: {checklist.source}. If your surface is not covered here, ask our team before you buy.</p>
              </div>
            )}

            {tab === "sheet" && (
              <div>
                {product.sheet ? (
                  <>
                    <p style={{ fontSize: 14, color: "#555", marginBottom: 16, lineHeight: 1.7 }}>The product sheet is the page for this product from the Peacock Paints catalogue.</p>
                    <a href={product.sheet} download style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", border: "2px solid " + B.coral, borderRadius: 24, color: B.coral, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Download product sheet (PDF)</a>
                  </>
                ) : (
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>There is no product sheet for this product yet. Ask our sales team and we will send it to you.</p>
                )}
              </div>
            )}
          </div>
        </div>

        /*__COLOUR__*/

        /*__RELATED__*/
      </div>
    </div>
  );
};

export default ProductDetailPage;
`;

// ───────────────────────── read and check the current page ─────────────────────────
const problems = [];
if (!fs.existsSync(PAGE) || !fs.existsSync(SWITCH) || !fs.existsSync(CSS)) { console.error("Cannot find the project files. Run this from the project root."); process.exit(1); }
if (fs.existsSync("src/data/checklists.js")) { console.error("src/data/checklists.js already exists - this step looks done."); process.exit(1); }

const old = fs.readFileSync(PAGE, "utf8").replace(/\r\n/g, "\n");
const lines = old.split("\n");

const retIdx = lines.findIndex(l => l === "  return (");
if (retIdx < 0) problems.push('Could not find "  return (" in ProductDetailPage.jsx');
const head = retIdx >= 0 ? lines.slice(0, retIdx).join("\n") : "";

const colourStart = lines.findIndex(l => l.includes("{/* Colour & Size Selection"));
const descIdx = lines.findIndex(l => l.includes("{/* Full Description */}"));
if (colourStart < 0 || descIdx < 0 || descIdx < colourStart) problems.push("Could not find the colour section markers");
const colourBlock = colourStart >= 0 && descIdx > colourStart ? lines.slice(colourStart, descIdx).join("\n").replace(/\s+$/, "") : "";

const relStart = lines.findIndex(l => l.includes("{/* Related Products */}"));
let relEnd = -1;
for (let i = lines.length - 1; i > relStart && relStart >= 0; i--) if (lines[i] === "        )}") { relEnd = i; break; }
if (relStart < 0 || relEnd < 0) problems.push("Could not find the related products section");
const tail = relEnd >= 0 ? lines.slice(relEnd + 1).join("\n").trim() : "";
if (relEnd >= 0 && (!tail.includes("export default ProductDetailPage") || (tail.match(/<\/div>/g) || []).length !== 2)) problems.push("The end of ProductDetailPage.jsx is not in the expected form");
const relatedBlock = relStart >= 0 && relEnd >= 0 ? lines.slice(relStart, relEnd + 1).join("\n") : "";

const qtyLine = "const [qty, setQty] = useState(1);";
if (head && head.split(qtyLine).length - 1 !== 1) problems.push(`Expected exactly one: ${qtyLine}`);
if (head && !head.includes("const handleAdd = () =>")) problems.push("handleAdd was not found in the page");
if (head && !head.includes("const related = PRODUCTS.filter")) problems.push("The related products code was not found in the page");

const sw = fs.readFileSync(SWITCH, "utf8").replace(/\r\n/g, "\n");
const swFind = "<ProductDetailPage product={selectedProduct}";
if (sw.split(swFind).length - 1 !== 1) problems.push(`PageSwitch.jsx: expected one ${swFind}`);
const css = fs.readFileSync(CSS, "utf8").replace(/\r\n/g, "\n");
if (css.includes(".pp-facts")) problems.push("global.css already has the product page styles");

// ───────────────────────── build the new page ─────────────────────────
let bodyHead = head.split("\n").filter(l => !l.startsWith("import ")).join("\n");
bodyHead = bodyHead.replace(qtyLine,
  qtyLine + `
  const checklist = checklistFor(product);
  const [tab, setTab] = useState(product.category === "industrial" && checklist ? "checklist" : "description");
  const [checked, setChecked] = useState({});
  const [activeImg, setActiveImg] = useState(null);`);

const code0 = bodyHead.replace(/\s+$/, "") + "\n\n" + PAGE_BODY.replace("/*__COLOUR__*/", () => colourBlock.replace(/^ {8}/gm, "        ").trim()).replace("/*__RELATED__*/", () => relatedBlock.trim());

// imports: only names that are really used
const ICONS = ["CartIcon", "SearchIcon", "UserIcon", "ChevDown", "ChevRight", "MenuIcon", "CloseIcon", "Arr", "ArrL", "PhoneIcon", "MailIcon", "TruckIcon", "PaletteIcon", "HeartIcon", "GlobeIcon", "UsersIcon", "LeafIcon", "MinusIcon", "PlusIcon", "CheckIcon", "StarIcon"];
const SOURCES = [
  ["../components/icons/Icons.jsx", ICONS],
  ["../data/theme.js", ["B"]],
  ["../data/products.js", ["PRODUCTS", "CATEGORIES"]],
  ["../data/colours.js", ["trendingColours", "COLOUR_CATEGORIES", "STYLE_CATEGORIES"]],
  ["../data/checklists.js", ["checklistFor"]],
];
const strip = t => t.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/^\s*\/\/.*$/gm, "").replace(/"[^"\n]*"/g, '""').replace(/'[^'\n]*'/g, "''").replace(/\.\.\./g, " ");
const codeOnly = strip(code0);
const uses = n => new RegExp(`(?<![\\w$.])${n}(?![\\w$])`).test(codeOnly);
const imports = [];
const hooks = ["useState", "useEffect", "useRef"].filter(uses);
if (hooks.length) imports.push(`import { ${hooks.join(", ")} } from "react";`);
for (const [src, names] of SOURCES) {
  const used = names.filter(uses);
  if (used.length) imports.push(`import { ${used.join(", ")} } from "${src}";`);
}
const newPage = imports.join("\n") + "\n\n" + code0;

// ───────────────────────── checks, then write ─────────────────────────
try {
  const esbuild = createRequire(path.resolve("package.json"))("esbuild");
  for (const [f, c] of [[PAGE, newPage], ["src/data/checklists.js", CHECKLISTS_JS]]) {
    try { esbuild.transformSync(c, { loader: "jsx" }); } catch (e) { problems.push(`${f} would have a syntax error: ${String(e.message).split("\n").slice(0, 3).join(" ")}`); }
  }
} catch { console.log("(esbuild not found - skipped syntax check)"); }

if (problems.length) {
  console.error("\nStopped. Nothing was changed because of these problems:\n");
  problems.forEach(p => console.error("  - " + p));
  console.error("\nCopy this message and send it to Claude.");
  process.exit(1);
}

fs.writeFileSync("src/data/checklists.js", CHECKLISTS_JS, "utf8");
fs.writeFileSync(PAGE, newPage, "utf8");
fs.writeFileSync(SWITCH, sw.replace(swFind, () => "<ProductDetailPage key={selectedProduct.id} product={selectedProduct}"), "utf8");
fs.writeFileSync(CSS, css.replace(/\s*$/, "\n") + CSS_ADD, "utf8");

console.log("\nDone.");
console.log("  rewritten: src/pages/ProductDetailPage.jsx   (colour picker and related products kept as they were)");
console.log("  created:   src/data/checklists.js");
console.log("  edited:    src/pages/PageSwitch.jsx, src/styles/global.css");
console.log("\nTry it: npm run dev, open a paint (try Vinyl Silk Makula, Epoxy 2K Enamel, NC Sanding Sealer, Sync Thinner), and check:");
console.log("  - sizes, quantity, Add to cart and Select colour sit on their own rows, facts are in a grid");
console.log("  - the tabs work, and Before you start opens first for industrial products");
console.log("  - Select colour scrolls to the colour picker, and Add to cart puts the item in the cart");
console.log("Undo anytime with:  git checkout . ; git clean -fd src");
