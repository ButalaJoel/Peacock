import { useState } from "react";
import { B } from "../data/theme.js";
import { PRODUCTS } from "../data/products.js";
import { COLOUR_DETAILS } from "../data/colours.js";
import { CloseIcon, Arr, ArrL, MinusIcon, PlusIcon, CheckIcon } from "../components/icons/Icons.jsx";

const PAINT_RECOMMENDATIONS = PRODUCTS;

const ColourDetailPage = ({ colour, categoryName, onBack, onBackHome, onAddToCart, onAddSample, homeHref, backHref }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [buyOpen, setBuyOpen] = useState(false);
  const [selectedProd, setSelectedProd] = useState(null);
  const [selectedSz, setSelectedSz] = useState(null);
  const [buyQty, setBuyQty] = useState(1);
  const [buyAdded, setBuyAdded] = useState(false);
  const details = COLOUR_DETAILS[colour.name] || {};
  const slides = details.slides || [];
  const hasSlides = slides.length > 0;
  const borderColor = "rgba(0,0,0,.14)";

  const handleAddToCart = () => {
    if (!selectedProd || !selectedSz) return;
    const sz = selectedProd.sizes.find(s => s.size === selectedSz);
    if (onAddToCart) onAddToCart({ product: selectedProd, size: sz.size, price: sz.price, qty: buyQty, colour: colour.name });
    setBuyAdded(true);
    setTimeout(() => { setBuyOpen(false); setBuyAdded(false); setSelectedProd(null); setSelectedSz(null); setBuyQty(1); }, 1800);
  };

  return (
    <div>
      {/* Breadcrumb bar */}
      <div style={{ padding: "13px 28px", borderBottom: "1px solid #eee", background: "#fff" }}>
        <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#999", alignItems: "center" }}>
          <a href={homeHref} onClick={e => { e.preventDefault(); onBackHome(); }} style={{ textDecoration: "none", color: "#333", cursor: "pointer", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Home</a>
          <span style={{ fontSize: 16, color: "#ccc", lineHeight: 1 }}>›</span>
          <a href={backHref} onClick={e => { e.preventDefault(); onBack(); }} style={{ textDecoration: "none", color: "#333", cursor: "pointer", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>{categoryName}</a>
          <span style={{ fontSize: 16, color: "#ccc", lineHeight: 1 }}>›</span>
          <span style={{ color: "#555", textTransform: "uppercase", fontWeight: 700, letterSpacing: .5 }}>{colour.name}®</span>
        </div>
      </div>

      {/* Two-panel split */}
      <div style={{ display: "flex", height: "calc(100vh - 157px)", minHeight: 520 }}>

        {/* ── LEFT: paint info ── */}
        <div style={{
          width: "42%", flexShrink: 0,
          background: colour.color,
          padding: "44px 52px",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          {/* Colour name */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 50, fontWeight: 300, letterSpacing: -1,
            color: "#1a1a1a", lineHeight: 1.1, marginBottom: 22,
          }}>
            {colour.name}®
          </h1>

          {/* Swatch ┃ tagline row */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 18 }}>
            <div style={{
              width: 68, height: 68, borderRadius: "50%",
              background: colour.color,
              border: "3px solid rgba(255,255,255,.85)",
              boxShadow: "0 2px 18px rgba(0,0,0,.18)",
              flexShrink: 0,
            }} />
            <div style={{ width: 1, height: 48, background: borderColor, flexShrink: 0 }} />
            <p style={{ fontSize: 14.5, color: "#2a2a2a", fontWeight: 400, lineHeight: 1.45, maxWidth: 220 }}>
              {details.tagline || colour.desc}
            </p>
          </div>

          {/* Long description */}
          <p style={{ fontSize: 13.5, lineHeight: 1.85, color: "#3a3a3a", marginBottom: 22, maxWidth: 400 }}>
            {details.longDesc || colour.desc}
          </p>

          {/* Specs: TONES / HUES / COLOUR */}
          <div style={{
            display: "flex",
            borderTop: `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
            padding: "14px 0", marginBottom: 26,
          }}>
            {[
              { label: "TONES",  value: details.tones || "—" },
              { label: "HUES",   value: details.hues  || "—" },
              { label: "COLOUR", value: colour.color },
            ].map((spec, i) => (
              <div key={i} style={{
                flex: 1,
                paddingLeft: i > 0 ? 20 : 0,
                paddingRight: i < 2 ? 20 : 0,
                borderRight: i < 2 ? `1px solid ${borderColor}` : "none",
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(0,0,0,.42)", marginBottom: 5 }}>{spec.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{spec.value}</div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => { setBuyOpen(true); setSelectedProd(null); setSelectedSz(null); setBuyQty(1); setBuyAdded(false); }} style={{
              flex: 1, padding: "14px 20px", border: "none", background: "#1a1a1a",
              color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", letterSpacing: .5, borderRadius: 2,
            }}>Buy Paint</button>
            <button onClick={() => onAddSample(colour.name)} style={{
              flex: 1, padding: "14px 20px",
              border: "2px solid rgba(0,0,0,.38)", background: "transparent",
              color: "#1a1a1a", fontSize: 14, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", letterSpacing: .5, borderRadius: 2,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>+ Add sample</button>
          </div>
        </div>

        {/* ── Buy Paint Modal ── */}
        {buyOpen && (
          <div onClick={() => setBuyOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.58)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, padding: "36px 36px 28px", maxWidth: 580, width: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 72px rgba(0,0,0,0.32)" }}>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: colour.color, border: "2px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: "#888" }}>{colour.name}</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a", fontFamily: "'Outfit', sans-serif" }}>Buy Paint</h2>
                </div>
                <button onClick={() => setBuyOpen(false)} style={{ background: "none", border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center", color: "#555" }}>
                  <CloseIcon />
                </button>
              </div>

              {/* Step 1 */}
              <div style={{ marginBottom: 26 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#bbb", marginBottom: 12 }}>Step 1 — Choose paint type</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {PAINT_RECOMMENDATIONS.map(prod => {
                    const isSel = selectedProd?.id === prod.id;
                    return (
                      <div key={prod.id} onClick={() => { setSelectedProd(prod); setSelectedSz(null); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, border: `2px solid ${isSel ? "#1a1a1a" : "#e8e4de"}`, cursor: "pointer", background: isSel ? "#faf8f5" : "#fff", transition: "all 0.15s" }}>
                        <img src={prod.img} alt={prod.name} style={{ width: 46, height: 46, objectFit: "contain", borderRadius: 6, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>{prod.name}</div>
                          <div style={{ fontSize: 11.5, color: "#999" }}>{prod.finish} &bull; {prod.category === "interior" ? "Interior" : "Exterior"}</div>
                        </div>
                        {isSel && <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><CheckIcon /></div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 */}
              {selectedProd && (
                <div style={{ marginBottom: 26 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#bbb", marginBottom: 12 }}>Step 2 — Choose size</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {selectedProd.sizes.map(sz => {
                      const isSel = selectedSz === sz.size;
                      return (
                        <div key={sz.size} onClick={() => setSelectedSz(sz.size)} style={{ flex: 1, padding: "15px 10px", borderRadius: 10, border: `2px solid ${isSel ? "#1a1a1a" : "#e8e4de"}`, cursor: "pointer", textAlign: "center", background: isSel ? "#faf8f5" : "#fff", transition: "all 0.15s" }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{sz.size}</div>
                          <div style={{ fontSize: 13, color: B.coral, fontWeight: 700, marginBottom: 2 }}>Ksh {sz.price.toLocaleString()}</div>
                          <div style={{ fontSize: 10.5, color: "#aaa" }}>Covers {sz.coverage}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3 — Quantity */}
              {selectedProd && selectedSz && (
                <div style={{ marginBottom: 26 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#bbb", marginBottom: 12 }}>Step 3 — How many tins?</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 0, border: "2px solid #e8e4de", borderRadius: 10, overflow: "hidden", width: "fit-content" }}>
                    <button onClick={() => setBuyQty(q => Math.max(1, q - 1))} style={{ width: 48, height: 48, background: "#faf8f5", border: "none", cursor: "pointer", fontSize: 20, color: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif" }}>
                      <MinusIcon />
                    </button>
                    <div style={{ minWidth: 60, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#1a1a1a", borderLeft: "2px solid #e8e4de", borderRight: "2px solid #e8e4de", background: "#fff" }}>
                      {buyQty}
                    </div>
                    <button onClick={() => setBuyQty(q => q + 1)} style={{ width: 48, height: 48, background: "#faf8f5", border: "none", cursor: "pointer", fontSize: 20, color: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif" }}>
                      <PlusIcon />
                    </button>
                  </div>
                  {selectedProd && selectedSz && (() => {
                    const sz = selectedProd.sizes.find(s => s.size === selectedSz);
                    return sz ? (
                      <div style={{ marginTop: 10, fontSize: 13, color: "#888" }}>
                        Total: <strong style={{ color: "#1a1a1a", fontSize: 15 }}>Ksh {(sz.price * buyQty).toLocaleString()}</strong>
                        <span style={{ marginLeft: 10, color: "#bbb" }}>({buyQty} × Ksh {sz.price.toLocaleString()})</span>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Add to Cart */}
              <button disabled={!selectedProd || !selectedSz} onClick={handleAddToCart} style={{ width: "100%", padding: "15px 24px", background: buyAdded ? B.teal : (selectedProd && selectedSz ? "#1a1a1a" : "#d0d0d0"), color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: selectedProd && selectedSz ? "pointer" : "not-allowed", fontFamily: "'Outfit', sans-serif", letterSpacing: 0.4, transition: "background 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {buyAdded ? <><CheckIcon /> Added to Cart!</> : `Add ${buyQty > 1 ? buyQty + " tins" : "to Cart"}`}
              </button>
            </div>
          </div>
        )}

        {/* ── RIGHT: lifestyle image ── */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {hasSlides ? (
            <>
              {slides.map((src, i) => (
                <img key={i} src={src} alt=""
                  style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "cover", transition: "opacity .55s ease",
                    opacity: i === imgIdx ? 1 : 0,
                  }} />
              ))}
              {/* Carousel nav bar */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "rgba(0,0,0,.72)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "13px 0", gap: 28,
              }}>
                <button onClick={() => setImgIdx(i => (i - 1 + slides.length) % slides.length)}
                  style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
                  <ArrL />
                </button>
                <div style={{ display: "flex", gap: 8 }}>
                  {slides.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)} style={{
                      width: i === imgIdx ? 24 : 8, height: 8, borderRadius: 4,
                      background: i === imgIdx ? "#fff" : "rgba(255,255,255,.42)",
                      border: "none", cursor: "pointer", transition: "all .3s", padding: 0,
                    }} />
                  ))}
                </div>
                <button onClick={() => setImgIdx(i => (i + 1) % slides.length)}
                  style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
                  <Arr />
                </button>
              </div>
            </>
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: `linear-gradient(145deg, ${colour.color}55 0%, ${colour.color}22 100%)`,
            }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ColourDetailPage;
