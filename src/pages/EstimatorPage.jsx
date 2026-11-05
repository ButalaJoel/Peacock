import { useState } from "react";
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

// Weight-based products: perKg = [fewest, most] square metres covered by one kilogram; packs = [{ size, kg }].
function estimateKg(config, area, coats) {
  if (!(area > 0)) return null;
  const need = area * coats;
  const round = n => Math.round(n * 10) / 10;
  const kgFewest = round(need / config.perKg[1]);
  const kgRecommended = round(need / config.perKg[0]);
  const packs = config.packs.slice().sort((a, b) => b.kg - a.kg);
  let left = Math.ceil(kgRecommended);
  const items = [];
  packs.forEach((p, i) => {
    const qty = i === packs.length - 1 ? Math.ceil(left / p.kg) : Math.floor(left / p.kg);
    if (qty > 0) items.push({ size: p.size, qty });
    left -= qty * p.kg;
  });
  const per = config.perKg[0] === config.perKg[1] ? config.perKg[0] : config.perKg[0] + " to " + config.perKg[1];
  return {
    type: "kg", area, coats, kgFewest, kgRecommended, items, needsReview: false,
    assumption: "1 kg covers " + per + " m² (catalogue figure), for " + coats + (coats === 1 ? " coat" : " coats") + ". Packs are rounded up to whole packs.",
  };
}


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
  const result = config.perKg ? estimateKg(config, area, coats) : estimate(product, config, { area, coats, variantIndex });

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
            <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>Check the product guidance for how many coats your surface needs. Rough surfaces use 25 to 30% more.</p>
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
                {result.type === "kg" ? (result.kgFewest === result.kgRecommended ? result.kgRecommended : result.kgFewest + " to " + result.kgRecommended) + " kg" : result.type === "kit"
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
                This is an estimate, not a guarantee. Actual use depends on the surface condition, preparation, application method and conditions. Rough surfaces, such as roughcast, bare block or unplastered concrete, can use 25 to 30% more than the figures shown.
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
        Not every product can be calculated here yet. For anything not listed, request a quote and our sales team will work out the quantity with you.
      </p>
    </div>
  );
}
