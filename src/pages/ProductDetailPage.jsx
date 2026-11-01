import { useState, useRef } from "react";
import { CartIcon, Arr, ArrL, PaletteIcon, MinusIcon, PlusIcon, CheckIcon } from "../components/icons/Icons.jsx";
import { B } from "../data/theme.js";
import { PRODUCTS, CATEGORIES } from "../data/products.js";
import { trendingColours, COLOUR_CATEGORIES } from "../data/colours.js";
import { checklistFor } from "../data/checklists.js";


const ProductDetailPage = ({ product, onBack, onAddToCart, onOpenProduct }) => {
  const [selectedSize, setSelectedSize] = useState(0);
  const [qty, setQty] = useState(1);
  const checklist = checklistFor(product);
  const [tab, setTab] = useState(product.category === "industrial" && checklist ? "checklist" : "description");
  const [checked, setChecked] = useState({});
  const [activeImg, setActiveImg] = useState(null);
  const [addedAnim, setAddedAnim] = useState(false);
  const sz = product.sizes[selectedSize];
  
  
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
    const item = { product, size: sz.size, qty };
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

  const mainImg = activeImg || (product.imgBySize && product.imgBySize[sz.size]) || product.img;
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

        {/* Colour & Size Selection — immediately visible */}
        {product.colourSystems.length > 0 && (
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
            
            const handleColourSelect = (name) => {
              if (selectedColourName === name) { setSelectedColourName(null); }
              else { setSelectedColourName(name); setColourSizeIdx(0); setColourQty(1); setColourAddedAnim(false); }
            };
            const handleColourAdd = () => {
              onAddToCart({ product, size: colourSz.size, qty: colourQty, colour: selectedColourName });
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
                          <div style={{ fontSize: 13, color: "#777", marginBottom: 12 }}>Coverage: {colourSz.coverage}</div>

                          {/* Quantity */}
                          <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#999", display: "block", marginBottom: 8 }}>Qty</label>
                          <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e0e0e0", borderRadius: 8, overflow: "hidden", width: "fit-content", marginBottom: 14 }}>
                            <button onClick={() => setColourQty(Math.max(1, colourQty - 1))} style={{ width: 36, height: 36, border: "none", background: colourQty <= 1 ? "#f5f5f5" : "#fff", cursor: colourQty <= 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: colourQty <= 1 ? "#ccc" : "#333" }}><MinusIcon /></button>
                            <div style={{ width: 40, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, borderLeft: "1px solid #e0e0e0", borderRight: "1px solid #e0e0e0" }}>{colourQty}</div>
                            <button onClick={() => setColourQty(Math.min(50, colourQty + 1))} style={{ width: 36, height: 36, border: "none", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><PlusIcon /></button>
                          </div>

                          {/* Total + Add to Cart */}
                          <div style={{ fontSize: 13, color: "#777", marginBottom: 10 }}>{colourQty} × {colourSz.size}</div>
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

        )}

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
                    <span style={{ fontSize: 13, fontWeight: 600, color: B.coral }}>View details</span>
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
