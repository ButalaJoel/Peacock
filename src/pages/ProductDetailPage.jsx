import { useState, useRef } from "react";
import { B } from "../data/theme.js";
import { PRODUCTS } from "../data/products.js";
import { trendingColours, COLOUR_CATEGORIES } from "../data/colours.js";
import { CartIcon, Arr, ArrL, TruckIcon, PaletteIcon, MinusIcon, PlusIcon, CheckIcon, StarIcon } from "../components/icons/Icons.jsx";

const ProductDetailPage = ({ product, onBack, onAddToCart, onOpenProduct }) => {
  const [selectedSize, setSelectedSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);
  const sz = product.sizes[selectedSize];
  const total = sz.price * qty;
  const fmtPrice = (p) => `UGX ${p.toLocaleString()}`;
  const colourSectionRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedColourName, setSelectedColourName] = useState(null);
  const [colourSizeIdx, setColourSizeIdx] = useState(0);
  const [colourQty, setColourQty] = useState(1);
  const [colourAddedAnim, setColourAddedAnim] = useState(false);
  const carouselRef = useRef(null);
  const scrollCarousel = (dir) => { if (carouselRef.current) carouselRef.current.scrollBy({ left: dir * 280, behavior: "smooth" }); };
  const hexRgba = (hex, a) => { const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16); return `rgba(${r},${g},${b},${a})`; };

  const handleAdd = () => {
    const item = { product, size: sz.size, price: sz.price, qty };
    if (selectedColourName) item.colour = selectedColourName;
    onAddToCart(item);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2000);
  };

  const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
  if (related.length < 3) {
    const others = PRODUCTS.filter(p => p.id !== product.id && !related.find(r => r.id === p.id));
    while (related.length < 3 && others.length) related.push(others.shift());
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px" }}>
        <div style={{ display: "flex", gap: 8, fontSize: 13, color: "#999" }}>
          <span onClick={onBack} style={{ color: B.coral, cursor: "pointer" }}>Home</span>
          <span>/</span><span>Paints</span><span>/</span>
          <span style={{ textTransform: "capitalize" }}>{product.category}</span><span>/</span>
          <span style={{ color: "#333" }}>{product.name}</span>
        </div>
      </div>

      {/* Main Product Area */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px 60px" }}>
        <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          {/* Left: Image */}
          <div>
            <div style={{ background: B.off, borderRadius: 16, padding: "40px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 480, position: "relative" }}>
              {product.img && <img src={product.img} alt={product.name} style={{ maxHeight: 400, maxWidth: "85%", objectFit: "contain", filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.15))" }} />}
              {product.tag && <span style={{ position: "absolute", top: 20, left: 20, background: product.tag === "Best Seller" ? B.coral : product.tag === "New" ? B.teal : product.tag === "Specialist" ? B.gold : "#5C2D6D", color: "#fff", fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 24 }}>{product.tag}</span>}
              {product.grade && <span style={{ position: "absolute", top: 20, right: 20, background: "#fff", border: `2px solid ${B.coral}`, color: B.coral, fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 24 }}>Grade {product.grade}</span>}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: B.coral, fontWeight: 600, marginBottom: 8 }}>{product.category} paint</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>{product.name}</h1>
            
            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= Math.floor(product.rating)} />)}</div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{product.rating}</span>
              <span style={{ fontSize: 13, color: "#999" }}>({product.reviews} reviews)</span>
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#555", marginBottom: 28 }}>{product.desc}</p>

            {/* Size Selection */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#333", display: "block", marginBottom: 12 }}>Select Size</label>
              <div style={{ display: "flex", gap: 12 }}>
                {product.sizes.map((s, i) => (
                  <button key={i} onClick={() => { setSelectedSize(i); setQty(1); }} style={{
                    flex: 1, padding: "16px 20px", borderRadius: 10, border: `2px solid ${selectedSize === i ? B.coral : "#e0e0e0"}`,
                    background: selectedSize === i ? `${B.coral}08` : "#fff", cursor: "pointer", transition: "all 0.2s", textAlign: "left", position: "relative", fontFamily: "'Outfit', sans-serif"
                  }}>
                    {selectedSize === i && <div style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: B.coral, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><CheckIcon /></div>}
                    <div style={{ fontSize: 20, fontWeight: 700, color: selectedSize === i ? B.coral : "#333", marginBottom: 4 }}>{s.size}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{fmtPrice(s.price)}</div>
                    <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>Coverage: {s.coverage}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#333", display: "block", marginBottom: 12 }}>Quantity</label>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", border: "2px solid #e0e0e0", borderRadius: 10, overflow: "hidden" }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 48, height: 48, border: "none", background: qty <= 1 ? "#f5f5f5" : "#fff", cursor: qty <= 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: qty <= 1 ? "#ccc" : "#333" }}><MinusIcon /></button>
                  <div style={{ width: 64, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600, borderLeft: "1px solid #e0e0e0", borderRight: "1px solid #e0e0e0" }}>{qty}</div>
                  <button onClick={() => setQty(Math.min(50, qty + 1))} style={{ width: 48, height: 48, border: "none", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><PlusIcon /></button>
                </div>
                <div style={{ fontSize: 13, color: "#999" }}>{qty} × {sz.size} = {fmtPrice(total)}</div>
              </div>
            </div>

            {/* Total & Add to Cart */}
            <div style={{ background: B.off, borderRadius: 12, padding: "20px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, color: "#999", marginBottom: 2 }}>Total</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: B.black }}>{fmtPrice(total)}</div>
              </div>
              {total >= 200000 && <div style={{ display: "flex", alignItems: "center", gap: 6, color: B.teal, fontSize: 13, fontWeight: 600 }}><TruckIcon /> Free delivery</div>}
            </div>

            {/* Selected colour indicator */}
            {selectedColourName && (() => {
              const colData = trendingColours.find(c => c.name === selectedColourName);
              return (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: colData ? hexRgba(colData.color, 0.08) : B.off, borderRadius: 10, border: `1.5px solid ${colData ? hexRgba(colData.color, 0.3) : "#e0e0e0"}`, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {colData && <div style={{ width: 28, height: 28, borderRadius: "50%", background: colData.color, border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", flexShrink: 0 }} />}
                    <div>
                      <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Colour</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedColourName}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedColourName(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#999", padding: 4 }} title="Remove colour">×</button>
                </div>
              );
            })()}

            <button onClick={handleAdd} style={{
              width: "100%", padding: "16px 32px", borderRadius: 10, border: "none", background: addedAnim ? B.teal : B.coral, color: "#fff",
              fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 0.3s", fontFamily: "'Outfit', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10, letterSpacing: 0.5, textTransform: "uppercase"
            }}>
              {addedAnim ? <><CheckIcon /> Added to Cart!</> : <><CartIcon /> Add to Cart</>}
            </button>

            <button
              onClick={() => colourSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
              style={{ marginTop: 12, width: "100%", padding: "14px 24px", borderRadius: 10, border: `2px solid ${B.coral}`, background: "transparent", color: B.coral, fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: 0.5, textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = B.coral; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = B.coral; }}
            >
              <PaletteIcon /> {selectedColourName ? "Change Colour" : "Select Colour"}
            </button>

            {/* Specs */}
            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Finish", value: product.finish },
                { label: "Dry Time", value: product.dryTime },
                { label: "Coats", value: product.coats },
                { label: "Surface", value: product.surface },
                { label: "Colours", value: product.colours },
                { label: "Coverage", value: sz.coverage },
              ].map((spec, i) => (
                <div key={i} style={{ padding: "12px 16px", background: B.off, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{spec.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{spec.value}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Colour & Size Selection — immediately visible */}
        <div ref={colourSectionRef} style={{ marginTop: 48, paddingTop: 36, borderTop: "1px solid #e8e4de" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Select Colour & Size</h2>
          <p style={{ fontSize: 15, color: "#777", marginBottom: 32 }}>Choose from our full range of colours available for this paint.</p>

          {/* Category Carousel */}
          <div style={{ position: "relative", paddingLeft: 28, paddingRight: 28 }}>
            <button onClick={() => scrollCarousel(-1)} style={{ position: "absolute", left: 0, top: 55, zIndex: 2, width: 40, height: 40, borderRadius: "50%", border: "1px solid #ddd", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}><ArrL /></button>
            <div ref={carouselRef} style={{ display: "flex", gap: 20, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: 4 }}>
              {Object.keys(COLOUR_CATEGORIES).map(catName => {
                const cat = COLOUR_CATEGORIES[catName];
                const isSelected = selectedCategory === catName;
                return (
                  <div key={catName} style={{ minWidth: 180, flexShrink: 0 }}>
                    <div
                      onClick={() => setSelectedCategory(isSelected ? null : catName)}
                      style={{ height: 100, background: cat.repColor, borderRadius: 12, border: isSelected ? "2px solid #1a1a1a" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s", marginBottom: 10 }}
                    />
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{catName}</div>
                    <button
                      onClick={() => setSelectedCategory(isSelected ? null : catName)}
                      style={{ display: "flex", alignItems: "center", gap: 6, background: isSelected ? "#1a1a1a" : "#fff", color: isSelected ? "#fff" : "#333", border: "1px solid #ddd", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Outfit', sans-serif" }}
                    >
                      {isSelected ? `Hide ${cat.colors.length} shades` : `See ${cat.colors.length} shades`}
                      &nbsp;{isSelected ? "↓" : "→"}
                    </button>
                  </div>
                );
              })}
            </div>
            <button onClick={() => scrollCarousel(1)} style={{ position: "absolute", right: 0, top: 55, zIndex: 2, width: 40, height: 40, borderRadius: "50%", border: "1px solid #ddd", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}><Arr /></button>
          </div>

          {/* Expanded Colour Grid */}
          {selectedCategory && (() => {
            const cat = COLOUR_CATEGORIES[selectedCategory];
            const colours = cat.colors.map(n => trendingColours.find(c => c.name === n)).filter(Boolean);
            const isColourSelected = (name) => selectedColourName === name;
            const colourSz = product.sizes[colourSizeIdx];
            const colourTotal = colourSz.price * colourQty;
            const handleColourSelect = (name) => {
              if (selectedColourName === name) { setSelectedColourName(null); }
              else { setSelectedColourName(name); setColourSizeIdx(0); setColourQty(1); setColourAddedAnim(false); }
            };
            const handleColourAdd = () => {
              onAddToCart({ product, size: colourSz.size, price: colourSz.price, qty: colourQty, colour: selectedColourName });
              setColourAddedAnim(true);
              setTimeout(() => setColourAddedAnim(false), 2000);
            };
            return (
              <div style={{ marginTop: 48 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                  {colours.map(col => {
                    const active = isColourSelected(col.name);
                    return (
                    <div key={col.name} style={{ border: active ? `2px solid ${B.coral}` : "2px solid transparent", borderRadius: 16, padding: active ? 14 : 0, transition: "all 0.2s" }}>
                      <div onClick={() => handleColourSelect(col.name)} style={{ cursor: "pointer" }}>
                        <div style={{ background: hexRgba(col.color, 0.12), borderRadius: 12, padding: "28px 16px", display: "flex", alignItems: "center", justifyContent: "center", height: 200, marginBottom: 14, position: "relative" }}>
                          <div style={{ width: 130, height: 130, background: col.color, borderRadius: "52% 48% 56% 44% / 48% 52% 48% 52%", boxShadow: `0 10px 28px ${hexRgba(col.color, 0.5)}, inset 0 -6px 16px rgba(0,0,0,0.18), inset 0 6px 14px rgba(255,255,255,0.22)` }} />
                          {active && <div style={{ position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: "50%", background: B.coral, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><CheckIcon /></div>}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, color: active ? B.coral : "#333" }}>{col.name}</div>
                        <div style={{ fontSize: 13, color: "#999", marginBottom: 8 }}>{col.desc}</div>
                      </div>

                      {!active ? (
                        <>
                          <div style={{ fontSize: 14, marginBottom: 3 }}>From <strong>{fmtPrice(product.sizes[0].price)}</strong></div>
                          <div style={{ fontSize: 12, color: "#bbb", marginBottom: 12 }}>{product.sizes.map(s => s.size).join(" · ")}</div>
                          <button onClick={() => handleColourSelect(col.name)} style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #ddd", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", background: "#fff", color: "#333", fontFamily: "'Outfit', sans-serif" }}>
                            Select sizes&nbsp;<Arr />
                          </button>
                        </>
                      ) : (
                        <div style={{ marginTop: 8 }}>
                          {/* Size pills */}
                          <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#999", display: "block", marginBottom: 8 }}>Size</label>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                            {product.sizes.map((s, i) => (
                              <button key={i} onClick={() => { setColourSizeIdx(i); setColourQty(1); }} style={{
                                padding: "8px 14px", borderRadius: 8, border: `2px solid ${colourSizeIdx === i ? B.coral : "#e0e0e0"}`,
                                background: colourSizeIdx === i ? `${B.coral}10` : "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
                                color: colourSizeIdx === i ? B.coral : "#333", fontFamily: "'Outfit', sans-serif", transition: "all 0.2s"
                              }}>
                                {s.size}
                              </button>
                            ))}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{fmtPrice(colourSz.price)} <span style={{ fontWeight: 400, fontSize: 12, color: "#999" }}>/ {colourSz.coverage}</span></div>

                          {/* Quantity */}
                          <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#999", display: "block", marginBottom: 8 }}>Qty</label>
                          <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e0e0e0", borderRadius: 8, overflow: "hidden", width: "fit-content", marginBottom: 14 }}>
                            <button onClick={() => setColourQty(Math.max(1, colourQty - 1))} style={{ width: 36, height: 36, border: "none", background: colourQty <= 1 ? "#f5f5f5" : "#fff", cursor: colourQty <= 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: colourQty <= 1 ? "#ccc" : "#333" }}><MinusIcon /></button>
                            <div style={{ width: 40, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, borderLeft: "1px solid #e0e0e0", borderRight: "1px solid #e0e0e0" }}>{colourQty}</div>
                            <button onClick={() => setColourQty(Math.min(50, colourQty + 1))} style={{ width: 36, height: 36, border: "none", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><PlusIcon /></button>
                          </div>

                          {/* Total + Add to Cart */}
                          <div style={{ fontSize: 13, color: "#777", marginBottom: 10 }}>{colourQty} × {colourSz.size} = <strong style={{ color: B.coral }}>{fmtPrice(colourTotal)}</strong></div>
                          <button onClick={handleColourAdd} style={{
                            width: "100%", padding: "12px", borderRadius: 8, border: "none",
                            background: colourAddedAnim ? B.teal : B.coral, color: "#fff",
                            fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
                            fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                          }}>
                            {colourAddedAnim ? <><CheckIcon /> Added!</> : <><CartIcon /> Add to Cart</>}
                          </button>
                        </div>
                      )}
                    </div>
                  );})}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Full Description */}
        <div style={{ marginTop: 60, paddingTop: 40, borderTop: "1px solid #e8e4de" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Product Description</h2>
          {product.longDesc.split("\n\n").map((p, i) => (<p key={i} style={{ fontSize: 15, lineHeight: 1.85, color: "#555", marginBottom: 16, maxWidth: 800 }}>{p}</p>))}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: 60, paddingTop: 40, borderTop: "1px solid #e8e4de" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 24 }}>You may also like</h2>
            <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {related.map(r => (
                <div key={r.id} onClick={() => onOpenProduct(r)}
                  style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", overflow: "hidden", cursor: "pointer", transition: "transform 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                  <div style={{ background: B.off, padding: 20, display: "flex", alignItems: "center", justifyContent: "center", height: 180 }}>
                    {r.img && <img src={r.img} alt={r.name} style={{ maxHeight: 160, maxWidth: "75%", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }} />}
                  </div>
                  <div style={{ padding: 16 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{r.name}</h4>
                    <p style={{ fontSize: 13, color: "#777", marginBottom: 8 }}>{r.desc}</p>
                    <span style={{ fontSize: 15, fontWeight: 700, color: B.coral }}>From {fmtPrice(r.sizes[0].price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
