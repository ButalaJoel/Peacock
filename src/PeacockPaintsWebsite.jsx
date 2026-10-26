import { useState, useEffect, useRef } from "react";
import { LOGO_HEADER, LOGO_FOOTER, IMG_WEATHER, INSPO_SCANDI_SAGE, INSPO_LR_PALE_BEIGE, INSPO_KT_CREAM } from "./data/images.js";
import { B } from "./data/theme.js";
import { PRODUCTS, SAMPLE_POT, SAMPLE_BUNDLE } from "./data/products.js";
import { storyPages } from "./data/storyPages.js";
import { navData } from "./data/navData.js";
import { trendingColours, CAT_SWATCH_COLORS, COLOUR_CATEGORIES, STYLE_CATEGORIES, COLOUR_DETAILS } from "./data/colours.js";
import { BEDROOM_INSPIRATIONS, LIVING_ROOM_INSPIRATIONS, DINING_ROOM_INSPIRATIONS, KITCHEN_INSPIRATIONS, BATHROOM_INSPIRATIONS, ROOM_META } from "./data/inspirations.js";
import { CartIcon, SearchIcon, UserIcon, ChevDown, ChevRight, MenuIcon, CloseIcon, Arr, ArrL, PhoneIcon, MailIcon, TruckIcon, PaletteIcon, HeartIcon, GlobeIcon, UsersIcon, LeafIcon, MinusIcon, PlusIcon, CheckIcon, StarIcon } from "./components/icons/Icons.jsx";
import PaintBlob from "./components/common/PaintBlob.jsx";
import "./styles/global.css";

// ═══════ PAINT CATEGORY PAGE ═══════
const PaintCategoryPage = ({ category, title, subtitle, onOpenProduct, productHrefFn, homeHref, nav }) => {
  const products = PRODUCTS.filter(p => p.category === category);
  const fmtP = p => `UGX ${p.toLocaleString()}`;
  const gradient = category === "interior"
    ? `linear-gradient(135deg, ${B.coral}ee, ${B.coralDk})`
    : `linear-gradient(135deg, ${B.teal}ee, ${B.tealDk})`;
  return (
    <div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}>
        <a href={homeHref} onClick={e => { e.preventDefault(); nav("home"); }} style={{ textDecoration: "none", color: B.coral, fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a>
      </div>
      <div style={{ background: gradient, padding: "60px 24px", color: "#fff", textAlign: "center" }}>
        <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, opacity: .8, marginBottom: 12, fontWeight: 600 }}>Professionals — Products</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 600, marginBottom: 16 }}>{title}</h1>
        <p style={{ fontSize: 16, opacity: .9, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>{subtitle}</p>
      </div>
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
        <p style={{ fontSize: 15, color: "#666", marginBottom: 32 }}>{products.length} products available</p>
        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {products.map(p => (
            <a key={p.id} href={productHrefFn(p)} onClick={e => { e.preventDefault(); onOpenProduct(p); }}
              style={{ textDecoration: "none", color: "inherit", display: "block", background: "#fff", borderRadius: 12, border: "1px solid #eee", overflow: "hidden", cursor: "pointer", transition: "transform .3s, box-shadow .3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={{ background: B.off, padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "center", height: 200, position: "relative" }}>
                {p.img && <img src={p.img} alt={p.name} style={{ maxHeight: 170, maxWidth: "80%", objectFit: "contain", filter: "drop-shadow(0 6px 12px rgba(0,0,0,.12))" }} />}
                {p.tag && <span style={{ position: "absolute", top: 10, left: 10, background: p.tag === "Best Seller" ? B.coral : p.tag === "New" ? B.teal : p.tag === "Specialist" ? B.gold : "#5C2D6D", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>{p.tag}</span>}
                {p.grade && <span style={{ position: "absolute", top: 10, right: 10, background: "#fff", border: `2px solid ${B.coral}`, color: B.coral, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>G{p.grade}</span>}
              </div>
              <div style={{ padding: "16px 18px 18px" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{p.name}</h4>
                <p style={{ fontSize: 12, color: "#777", lineHeight: 1.4, marginBottom: 10, minHeight: 34 }}>{p.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: B.coral }}>From {fmtP(p.sizes[0].price)}</span>
                  <span style={{ fontSize: 12, color: "#999" }}>{p.sizes.map(s => s.size).join(" • ")}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

// ═══════ PRODUCT DETAIL PAGE ═══════
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

// ═══════ ROOM INSPIRATION PAGE (generic) ═══════

const RoomInspirationPage = ({ roomName, inspirations, onBack, nav, onAddSample, onAddSampleBundle }) => {
  const [selected, setSelected] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const meta = ROOM_META[roomName] || {};

  const openDetail = (item) => { setSelected(item); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const back = () => { setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const otherRooms = Object.entries(ROOM_META).filter(([name]) => name !== roomName).map(([name, m]) => ({
    name, slug: m.slug,
    bg: name === "Bedroom" ? "linear-gradient(135deg, #2d4a3e, #1a3a5c)" : name === "Living Room" ? "linear-gradient(135deg, #c87856, #a05040)" : name === "Dining Room" ? "linear-gradient(135deg, #7E2038, #3E5030)" : name === "Kitchen" ? "linear-gradient(135deg, #2d6b4f, #1a4a3a)" : "linear-gradient(135deg, #1a4a5e, #2868a8)",
    hasPage: !!({ "Bedroom": true, "Living Room": true, "Dining Room": true, "Kitchen": true, "Bathroom": true })[name],
  }));

  if (selected) {
    return (
      <div>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px" }}>
          <div style={{ display: "flex", gap: 8, fontSize: 13, color: "#999" }}>
            <span onClick={onBack} style={{ color: B.coral, cursor: "pointer" }}>Home</span>
            <span>/</span><span onClick={back} style={{ color: B.coral, cursor: "pointer" }}>{roomName} Inspiration</span>
            <span>/</span><span style={{ color: "#333" }}>{selected.title}</span>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px 60px" }}>
          {/* Hero Image */}
          <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 40, cursor: "pointer" }} onClick={() => setLightbox(selected.img)}>
            <img src={selected.img} alt={selected.title} style={{ width: "100%", height: 500, objectFit: "cover", display: "block" }} />
          </div>

          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
            {/* Left: Details */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: selected.colorHex, border: "3px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,.15)" }} />
                <div>
                  <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: B.coral, fontWeight: 600 }}>{selected.style}</span>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>{selected.title}</h1>
                </div>
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: "#555", marginBottom: 32 }}>{selected.desc}</p>

              {/* Colour Used */}
              <div style={{ background: B.off, borderRadius: 12, padding: "20px 24px", marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: selected.colorHex, flexShrink: 0, boxShadow: "inset 0 2px 4px rgba(0,0,0,.1)" }} />
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#999", marginBottom: 2 }}>Featured Colour</div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{selected.color}</div>
                </div>
                <button className="btn bp" onClick={() => {
                  const colourName = selected.color.replace(/®/g, "").trim();
                  const match = trendingColours.find(c => c.name === colourName);
                  if (match) onAddSample(match.name);
                }} style={{ marginLeft: "auto", fontSize: 12, padding: "10px 20px" }}>Order Sample</button>
              </div>

              {/* Recommended Products */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 16, color: "#333" }}>Recommended Products</h3>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {selected.products.map((p, i) => (
                    <span key={i} style={{ padding: "10px 20px", borderRadius: 8, background: "#fff", border: "1px solid #e0e0e0", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all .2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = B.coral; e.currentTarget.style.color = B.coral; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#1a1a1a"; }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Tips */}
            <div>
              <div style={{ background: `linear-gradient(135deg, ${selected.colorHex}18, ${selected.colorHex}08)`, borderRadius: 16, padding: 32, border: `1px solid ${selected.colorHex}30` }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, marginBottom: 24 }}>Styling Tips</h3>
                {selected.tips.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < selected.tips.length - 1 ? 20 : 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: selected.colorHex, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "#555" }}>{tip}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ marginTop: 24, background: B.black, borderRadius: 16, padding: 32, color: "#fff", textAlign: "center" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 8 }}>Love this look?</h3>
                <p style={{ fontSize: 14, opacity: .7, marginBottom: 20 }}>Get colour samples delivered to your door</p>
                <button className="btn bp" onClick={onAddSampleBundle} style={{ fontSize: 14 }}>Order Samples</button>
              </div>
            </div>
          </div>

          {/* More Inspiration */}
          <div style={{ marginTop: 60, paddingTop: 40, borderTop: "1px solid #e8e4de" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 24 }}>More {roomName.toLowerCase()} looks</h2>
            <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {inspirations.filter(x => x.id !== selected.id).slice(0, 3).map(item => (
                <div key={item.id} onClick={() => openDetail(item)} style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "transform .3s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                  <img src={item.img} alt={item.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
                  <div style={{ padding: 16, background: "#fff", border: "1px solid #eee", borderTop: "none", borderRadius: "0 0 12px 12px" }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.title}</h4>
                    <p style={{ fontSize: 13, color: "#777" }}>{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: 40 }}>
            <img src={lightbox} alt="" style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8 }} />
          </div>
        )}
      </div>
    );
  }

  // Gallery view
  const roomLower = roomName.toLowerCase();
  return (
    <div>
      {/* Hero Banner */}
      <section style={{ background: meta.gradient, padding: "80px 0 60px", color: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, marginBottom: 16, opacity: .8 }}>Inspiration / By Room</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, marginBottom: 16 }}>{roomName} Inspiration</h1>
          <p style={{ fontSize: 20, opacity: .9, fontWeight: 300 }}>{meta.subtitle}</p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#1a1a1a", color: "#fff", padding: "28px 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, textAlign: "center" }}>
          {[{ n: String(inspirations.length), l: "Curated Looks" }, { n: "80+", l: "Colours Available" }, { n: "Free", l: "Colour Samples" }].map((s, i) => (
            <div key={i}><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: B.coral }}>{s.n}</div><div style={{ fontSize: 12, opacity: .7, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div></div>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <h2 className="st" style={{ marginBottom: 8 }}>Curated {roomLower} looks</h2>
          <p style={{ fontSize: 15, color: "#666" }}>Click any look for colour details, styling tips, and product recommendations</p>
        </div>

        {/* Featured (first two items large) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>
          <div onClick={() => openDetail(inspirations[0])} style={{ position: "relative", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "transform .3s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
            <img src={inspirations[0].img} alt={inspirations[0].title} style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 50%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px" }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: B.coral, fontWeight: 600 }}>Featured</span>
              <h3 style={{ color: "#fff", fontSize: 24, fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: 4 }}>{inspirations[0].title}</h3>
              <p style={{ color: "rgba(255,255,255,.8)", fontSize: 14 }}>{inspirations[0].subtitle}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: inspirations[0].colorHex, border: "2px solid #fff" }} />
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{inspirations[0].color}</span>
              </div>
            </div>
          </div>
          <div onClick={() => openDetail(inspirations[1])} style={{ position: "relative", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "transform .3s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
            <img src={inspirations[1].img} alt={inspirations[1].title} style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 50%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px" }}>
              <h3 style={{ color: "#fff", fontSize: 22, fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: 4 }}>{inspirations[1].title}</h3>
              <p style={{ color: "rgba(255,255,255,.8)", fontSize: 14 }}>{inspirations[1].subtitle}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: inspirations[1].colorHex, border: "2px solid #fff" }} />
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{inspirations[1].color}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Remaining items */}
        {inspirations.length > 2 && (
          <div className="g3" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(inspirations.length - 2, 3)}, 1fr)`, gap: 20 }}>
            {inspirations.slice(2).map(item => (
              <div key={item.id} onClick={() => openDetail(item)} style={{ position: "relative", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "transform .3s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                <img src={item.img} alt={item.title} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px" }}>
                  <h3 style={{ color: "#fff", fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: 4 }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,.8)", fontSize: 13 }}>{item.subtitle}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: item.colorHex, border: "2px solid #fff" }} />
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{item.color}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Browse Other Rooms */}
      <section style={{ background: B.warm, padding: "60px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, textAlign: "center", marginBottom: 36 }}>Explore other rooms</h2>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${otherRooms.length}, 1fr)`, gap: 20 }}>
            {otherRooms.map((room, i) => (
              <div key={i} onClick={() => { if (room.hasPage) nav(room.slug); }} style={{ background: room.bg, borderRadius: 12, padding: 28, color: "#fff", cursor: room.hasPage ? "pointer" : "default", transition: "transform .3s", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "flex-end", opacity: room.hasPage ? 1 : .7 }}
                onMouseEnter={e => { if (room.hasPage) e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{room.name}</h3>
                <p style={{ fontSize: 13, opacity: .8 }}>{room.hasPage ? "View inspiration" : "Coming soon"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ═══════ COLOUR CATEGORY PAGE ═══════
const ColourCategoryPage = ({ categoryName, categoryData, allColours, onBack, onNavCategory, onOpenColour, onAddSample, onAddSampleBundle, onViewAllColours, homeHref, colourHrefFn, catHrefFn }) => {
  const categoryColors = allColours.filter(c => categoryData.colors.includes(c.name));
  const otherCats = Object.entries(COLOUR_CATEGORIES).filter(([k]) => k !== categoryName);

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px" }}>
        <div style={{ display: "flex", gap: 8, fontSize: 13, color: "#999" }}>
          <a href={homeHref} onClick={e => { e.preventDefault(); onBack(); }} style={{ textDecoration: "none", color: B.coral, cursor: "pointer", fontWeight: 500 }}>Home</a>
          <span>/</span><span>Colours</span><span>/</span>
          <span style={{ color: "#333" }}>{categoryName}</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: categoryData.gradient, padding: "64px 0 48px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, color: categoryData.accent || B.coral, fontWeight: 600, marginBottom: 12 }}>Colour Collection</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, marginBottom: 16, color: categoryData.textColor || "#1a1a1a" }}>{categoryName}</h1>
          <p style={{ fontSize: 17, color: categoryData.textColor || "#555", opacity: .75, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 24px" }}>{categoryData.desc}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.65)", padding: "8px 22px", borderRadius: 28, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.9)" }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: categoryData.accent || B.coral }}>{categoryColors.length}</span>
            <span style={{ fontSize: 13, color: "#666" }}>shades in this collection</span>
          </div>
        </div>
      </section>

      {/* Colour pill row */}
      <section style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "18px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {categoryColors.map((c, i) => (
            <a key={i} href={colourHrefFn ? colourHrefFn(c) : undefined} onClick={e => { e.preventDefault(); onOpenColour && onOpenColour(c); }}
              style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 7, background: "#f8f8f6", borderRadius: 24, padding: "5px 14px 5px 7px", border: "1px solid #ebebeb", cursor: "pointer", transition: "border-color .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#ccc"} onMouseLeave={e => e.currentTarget.style.borderColor = "#ebebeb"}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: c.color, border: "1px solid rgba(0,0,0,.1)", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>{c.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Colour Grid */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 className="st" style={{ marginBottom: 8 }}>All {categoryName}</h2>
          <p style={{ fontSize: 15, color: "#666" }}>Order a sample tester to see how it looks in your home</p>
        </div>
        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {categoryColors.map((c, i) => (
            <a key={i} href={colourHrefFn ? colourHrefFn(c) : undefined} onClick={e => { e.preventDefault(); onOpenColour && onOpenColour(c); }}
              style={{ textDecoration: "none", color: "inherit", display: "block", background: "#fff", borderRadius: 14, border: "1px solid #eee", overflow: "hidden", cursor: "pointer", transition: "transform .3s, box-shadow .3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              {/* Swatch area */}
              <div style={{ background: `${c.color}28`, padding: "20px 16px", height: 160, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ width: "78%", height: "90%" }}><PaintBlob color={c.color} v={i} /></div>
                <div style={{ position: "absolute", bottom: 10, right: 12, width: 28, height: 28, borderRadius: "50%", background: c.color, border: "3px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(0,0,0,.12)" }} />
              </div>
              {/* Details */}
              <div style={{ padding: "14px 16px 18px" }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: "#1a1a1a" }}>{c.name}®</h4>
                <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 12, minHeight: 34 }}>{c.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <code style={{ fontSize: 11, color: "#bbb", fontFamily: "monospace", letterSpacing: .5 }}>{c.color}</code>
                  <button onClick={e => { e.stopPropagation(); e.preventDefault(); onAddSample(c.name); }} style={{ fontSize: 11, fontWeight: 600, color: B.coral, background: `${B.coral}12`, border: "none", padding: "4px 10px", borderRadius: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Sample</button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)", padding: "56px 0", color: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 12 }}>Try before you buy</h2>
          <p style={{ fontSize: 15, opacity: .7, marginBottom: 28, lineHeight: 1.6 }}>Get 5 colour samples delivered to your door for just UGX 15,000</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn bp" onClick={onAddSampleBundle}>Order Samples</button>
            <button className="btn bo" onClick={onViewAllColours}>View All Colours</button>
          </div>
        </div>
      </section>

      {/* Explore other categories */}
      {otherCats.length > 0 && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, marginBottom: 24 }}>Explore more colour collections</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {otherCats.map(([name, data]) => (
              <a key={name} href={catHrefFn ? catHrefFn(name, data) : undefined} onClick={e => { e.preventDefault(); onNavCategory(name); }}
                style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 10, background: "#f8f8f6", border: "1px solid #eee", borderRadius: 12, padding: "11px 20px", cursor: "pointer", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f0ede8"; e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f8f8f6"; e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.transform = ""; }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: CAT_SWATCH_COLORS[name] || "#ddd", border: "2px solid rgba(0,0,0,.08)", flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{name}</span>
                <span style={{ fontSize: 12, color: "#aaa" }}>({allColours.filter(c => data.colors.includes(c.name)).length})</span>
              </a>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: "#bbb" }}>More colour collections coming soon</p>
        </section>
      )}
    </div>
  );
};

// ═══════ STYLE CATEGORY PAGE ═══════
const StyleCategoryPage = ({ styleName, styleData, allColours, onBack, onNavStyle, onOpenColour, onAddSample, onAddSampleBundle, onViewAllColours, homeHref, colourHrefFn, styleHrefFn }) => {
  const styleColors = allColours.filter(c => styleData.colors.includes(c.name));
  const otherStyles = Object.entries(STYLE_CATEGORIES).filter(([k]) => k !== styleName);

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px" }}>
        <div style={{ display: "flex", gap: 8, fontSize: 13, color: "#999" }}>
          <a href={homeHref} onClick={e => { e.preventDefault(); onBack(); }} style={{ textDecoration: "none", color: B.coral, cursor: "pointer", fontWeight: 500 }}>Home</a>
          <span>/</span><span>Colours</span><span>/</span><span>By Style</span><span>/</span>
          <span style={{ color: "#333" }}>{styleName}</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: styleData.gradient, padding: "64px 0 48px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, color: styleData.accent, fontWeight: 600, marginBottom: 12 }}>Style Collection</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, marginBottom: 12, color: styleData.textColor }}>{styleName}</h1>
          {/* Keywords */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
            {styleData.keyWords.map((kw, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, padding: "4px 14px", borderRadius: 24, background: `rgba(255,255,255,0.3)`, border: `1px solid rgba(255,255,255,0.5)`, color: styleData.textColor, backdropFilter: "blur(4px)" }}>{kw}</span>
            ))}
          </div>
          <p style={{ fontSize: 17, color: styleData.textColor, opacity: .75, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 24px" }}>{styleData.desc}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.65)", padding: "8px 22px", borderRadius: 28, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.9)" }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: styleData.accent }}>{styleColors.length}</span>
            <span style={{ fontSize: 13, color: "#666" }}>shades in this style</span>
          </div>
        </div>
      </section>

      {/* Colour pill row */}
      <section style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "18px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {styleColors.map((c, i) => (
            <a key={i} href={colourHrefFn ? colourHrefFn(c) : undefined} onClick={e => { e.preventDefault(); onOpenColour && onOpenColour(c); }}
              style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 7, background: "#f8f8f6", borderRadius: 24, padding: "5px 14px 5px 7px", border: "1px solid #ebebeb", cursor: "pointer", transition: "border-color .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#ccc"} onMouseLeave={e => e.currentTarget.style.borderColor = "#ebebeb"}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: c.color, border: "1px solid rgba(0,0,0,.1)", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>{c.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Colour Grid */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 className="st" style={{ marginBottom: 8 }}>All {styleName} Colours</h2>
          <p style={{ fontSize: 15, color: "#666" }}>Order a sample tester to see how it looks in your home</p>
        </div>
        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {styleColors.map((c, i) => (
            <a key={i} href={colourHrefFn ? colourHrefFn(c) : undefined} onClick={e => { e.preventDefault(); onOpenColour && onOpenColour(c); }}
              style={{ textDecoration: "none", color: "inherit", display: "block", background: "#fff", borderRadius: 14, border: "1px solid #eee", overflow: "hidden", cursor: "pointer", transition: "transform .3s, box-shadow .3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={{ background: `${c.color}28`, padding: "20px 16px", height: 160, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ width: "78%", height: "90%" }}><PaintBlob color={c.color} v={i} /></div>
                <div style={{ position: "absolute", bottom: 10, right: 12, width: 28, height: 28, borderRadius: "50%", background: c.color, border: "3px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(0,0,0,.12)" }} />
              </div>
              <div style={{ padding: "14px 16px 18px" }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: "#1a1a1a" }}>{c.name}®</h4>
                <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 12, minHeight: 34 }}>{c.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <code style={{ fontSize: 11, color: "#bbb", fontFamily: "monospace", letterSpacing: .5 }}>{c.color}</code>
                  <button onClick={e => { e.stopPropagation(); e.preventDefault(); onAddSample(c.name); }} style={{ fontSize: 11, fontWeight: 600, color: B.coral, background: `${B.coral}12`, border: "none", padding: "4px 10px", borderRadius: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Sample</button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)", padding: "56px 0", color: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 12 }}>Try before you buy</h2>
          <p style={{ fontSize: 15, opacity: .7, marginBottom: 28, lineHeight: 1.6 }}>Get 5 colour samples delivered to your door for just UGX 15,000</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn bp" onClick={onAddSampleBundle}>Order Samples</button>
            <button className="btn bo" onClick={onViewAllColours}>View All Colours</button>
          </div>
        </div>
      </section>

      {/* Explore other styles */}
      {otherStyles.length > 0 && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Explore more styles</h2>
          <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>Find the perfect palette for every design aesthetic</p>
          <div className="ge4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {otherStyles.map(([name, data]) => {
              const preview = allColours.filter(c => data.colors.includes(c.name)).slice(0, 5);
              return (
                <a key={name} href={styleHrefFn ? styleHrefFn(name, data) : undefined} onClick={e => { e.preventDefault(); onNavStyle(name); }}
                  style={{ textDecoration: "none", color: "inherit", display: "block", borderRadius: 14, overflow: "hidden", cursor: "pointer", border: "1px solid #eee", transition: "transform .3s, box-shadow .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  {/* Mini gradient hero */}
                  <div style={{ background: data.gradient, height: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 12px" }}>
                    {preview.map((c, ci) => (
                      <div key={ci} style={{ width: 28, height: 28, borderRadius: "50%", background: c.color, border: "2px solid rgba(255,255,255,.7)", boxShadow: "0 2px 6px rgba(0,0,0,.15)" }} />
                    ))}
                  </div>
                  <div style={{ padding: "12px 16px 16px", background: "#fff" }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{name}</h4>
                    <p style={{ fontSize: 12, color: "#999" }}>{allColours.filter(c => data.colors.includes(c.name)).length} shades</p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

// ═══════ COLOUR DETAIL PAGE ═══════
const PAINT_RECOMMENDATIONS = PRODUCTS; // all 12 products

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

// ═══════ MAIN APP ═══════
export default function PeacockPaintsWebsite() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobMenu, setMobMenu] = useState(false);
  const [mobSub, setMobSub] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pg, setPg] = useState("home");
  const [prodTab, setProdTab] = useState("all");
  const [finishFilter, setFinishFilter] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedColour, setSelectedColour] = useState(null);
  const [selectedColourCategory, setSelectedColourCategory] = useState(null);
  const [selectedColourStyle, setSelectedColourStyle] = useState(null);
  const [colourCarouselIdx, setColourCarouselIdx] = useState(0);
  const CARDS_VISIBLE = 5;
  const findColourCat = (name) => { for (const [k, v] of Object.entries(COLOUR_CATEGORIES)) { if (v.colors.includes(name)) return k; } return null; };
  const handleColourClick = (c) => { const cat = findColourCat(c.name); setSelectedColour(c); setSelectedColourCategory(cat); setPg("colour-detail"); setActiveMenu(null); setMobMenu(false); setMobSub(null); window.scrollTo({ top: 0, behavior: "smooth" }); window.history.replaceState(null, "", `#/colour/${encodeURIComponent(c.name)}`); };
  const mRef = useRef(null);
  const prodSectionRef = useRef(null);
  const scrollToProdPending = useRef(false);

  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => {
    if (heroPaused) return undefined;
    const t = setInterval(() => setHeroSlide(s => (s + 1) % 3), 6500);
    return () => clearInterval(t);
  }, [heroPaused]);

  // ─── Hash-based routing: restore page from URL on mount / new tab ───
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, "");
      if (!hash || hash === "home") { setPg("home"); return; }
      if (hash.startsWith("product/")) {
        const id = hash.replace("product/", "");
        const p = PRODUCTS.find(pr => pr.id === id);
        if (p) { setSelectedProduct(p); setPg("product"); return; }
      }
      if (hash.startsWith("colour/")) {
        const name = decodeURIComponent(hash.replace("colour/", ""));
        const c = trendingColours.find(tc => tc.name === name);
        if (c) { const cat = findColourCat(c.name); setSelectedColour(c); setSelectedColourCategory(cat); setPg("colour-detail"); return; }
      }
      setPg(hash);
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);
  useEffect(() => {
    if (scrollToProdPending.current && prodSectionRef.current) {
      scrollToProdPending.current = false;
      const t = setTimeout(() => prodSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      return () => clearTimeout(t);
    }
  }, [finishFilter]);

  const mE = i => { clearTimeout(mRef.current); setActiveMenu(i); };
  const mL = () => { mRef.current = setTimeout(() => setActiveMenu(null), 200); };
  const nav = p => { setPg(p); setSelectedProduct(null); setActiveMenu(null); setMobMenu(false); setMobSub(null); window.scrollTo({ top: 0, behavior: "smooth" }); window.history.replaceState(null, "", `#/${p}`); };
  const openProduct = (p) => { setSelectedProduct(p); setPg("product"); setActiveMenu(null); setMobMenu(false); setMobSub(null); window.scrollTo({ top: 0, behavior: "smooth" }); window.history.replaceState(null, "", `#/product/${p.id}`); };

  // ─── Hash URL helpers ───
  const makeHref = (slug) => `#/${slug}`;
  const productHref = (p) => `#/product/${p.id}`;
  const colourHref = (c) => `#/colour/${encodeURIComponent(c.name)}`;
  const aReset = { textDecoration: "none", color: "inherit" };
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === item.product.id && c.size === item.size && (c.colour || null) === (item.colour || null));
      if (existing) return prev.map(c => c.product.id === item.product.id && c.size === item.size && (c.colour || null) === (item.colour || null) ? { ...c, qty: c.qty + item.qty } : c);
      return [...prev, item];
    });
  };
  const addSamplePot = (colourName) => {
    addToCart({ product: SAMPLE_POT, size: "100ml", price: 3000, qty: 1, colour: colourName });
    setCartOpen(true);
  };
  const addSampleBundle = () => {
    addToCart({ product: SAMPLE_BUNDLE, size: "5 pots", price: 15000, qty: 1, colour: null });
    setCartOpen(true);
  };
  const removeFromCart = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));
  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const fmtP = p => `UGX ${p.toLocaleString()}`;
  const weathershield = PRODUCTS.find(p => p.id === "weathershield");
  const iconFor = s => ({ globe: <GlobeIcon/>, heart: <HeartIcon/>, palette: <PaletteIcon/>, users: <UsersIcon/>, leaf: <LeafIcon/>, truck: <TruckIcon/> }[s] || <PaletteIcon/>);

  const heroSlides = [
    {
      eyebrow: "New colour studio",
      title: "Paint your next room before the first brush stroke.",
      copy: "Compare Peacock shades, finishes, and real products in one warm studio built for homes, schools, shops, and site teams.",
      accent: "#ff4d8b",
      roomImg: INSPO_SCANDI_SAGE,
      swatches: [
        { name: "Rose", color: "#CC7B8C" },
        { name: "Balm", color: "#CADCCB" },
        { name: "Medallion", color: "#C49820" },
        { name: "Denim", color: "#1E3A68" },
      ],
      note: "Interior walls",
      cta2: "Explore colours",
      cta2Page: "colours",
    },
    {
      eyebrow: "Colour at home",
      title: "Give living rooms colour that holds its nerve.",
      copy: "Warm neutrals, rich masonry tones, and practical coverage details help every interior feel deliberate.",
      accent: "#1a3a3a",
      roomImg: INSPO_LR_PALE_BEIGE,
      swatches: [
        { name: "Lake Green", color: "#BFCA9E" },
        { name: "Tandoori", color: "#8E3020" },
        { name: "Cool Blue", color: "#A8C6D6" },
        { name: "Havana", color: "#3E5030" },
      ],
      note: "Living room",
      cta2: "Explore colours",
      cta2Page: "colours",
    },
    {
      eyebrow: "Specialist finishes",
      title: "From polished walls to tough workshop floors.",
      copy: "Browse coatings for wood, vehicles, decorative walls, and industrial surfaces with the same colour-first energy.",
      accent: "#b8a4ed",
      roomImg: INSPO_KT_CREAM,
      swatches: [
        { name: "Violet Bouquet", color: "#C0A0C8" },
        { name: "Copper", color: "#AD6040" },
        { name: "Pearl", color: "#EEE7C5" },
        { name: "Signal Blue", color: "#2848A0" },
      ],
      note: "Specialist systems",
      cta2: "Specialist finishes",
      cta2Page: "specialist",
    },
  ];
  const currentHero = heroSlides[heroSlide] || heroSlides[0];
  const openHeroProductGrid = (tab = "all") => {
    setPg("home");
    setSelectedProduct(null);
    setProdTab(tab);
    setFinishFilter(null);
    setActiveMenu(null);
    setMobMenu(false);
    setMobSub(null);
    setTimeout(() => prodSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };
  const shopHeroProducts = () => openHeroProductGrid("all");
  const exploreHero = () => {
    if (currentHero.cta2Page === "colours") { nav("all-colours"); return; }
    if (currentHero.cta2Page === "specialist") { openHeroProductGrid("specialist"); return; }
    nav(currentHero.cta2Page);
  };
  const showHeroSlide = (idx) => setHeroSlide((idx + heroSlides.length) % heroSlides.length);
  const openHeroSwatch = (swatch) => {
    const match = trendingColours.find(c => c.name === swatch.name);
    if (match) handleColourClick(match);
  };
  const handleMegaFooter = (label) => {
    if (label === "Shop all colours") nav("all-colours");
    if (label === "All interior paints") nav("interior-paint");
    if (label === "All exterior paints") nav("exterior-paint");
    if (label === "All specialist paints") openHeroProductGrid("specialist");
    if (label === "Get inspired") nav("bedroom-inspiration");
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const catOk = prodTab === "all" || p.category === prodTab;
    const finishOk = !finishFilter || p.finish.toLowerCase().includes(finishFilter.toLowerCase());
    return catOk && finishOk;
  });

  const currentColourCatName = Object.keys(COLOUR_CATEGORIES).find(k => COLOUR_CATEGORIES[k].slug === pg) || null;
  const currentStyleName = Object.keys(STYLE_CATEGORIES).find(k => STYLE_CATEGORIES[k].slug === pg) || null;

  const renderStory = key => {
    const p = storyPages[key]; if (!p) return null;
    return (<div>
      <section style={{ background: p.hg, padding: "80px 0 60px", color: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, marginBottom: 16, opacity: .8 }}>Our Story</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, marginBottom: 16 }}>{p.title}</h1>
          <p style={{ fontSize: 20, opacity: .9, fontWeight: 300 }}>{p.subtitle}</p>
        </div>
      </section>
      <section style={{ background: "#1a1a1a", color: "#fff", padding: "32px 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: `repeat(${p.stats.length}, 1fr)`, gap: 24, textAlign: "center" }}>
          {p.stats.map((s, i) => (<div key={i}><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: B.coral }}>{s.n}</div><div style={{ fontSize: 13, opacity: .7, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div></div>))}
        </div>
      </section>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        {p.sections.map((s, i) => (<div key={i} style={{ marginBottom: 56, paddingBottom: i < p.sections.length - 1 ? 56 : 0, borderBottom: i < p.sections.length - 1 ? "1px solid #e8e4de" : "none" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${B.coral}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: B.coral }}>{iconFor(s.i)}</div>
            <div><h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 16 }}>{s.t}</h2>
              {s.c.split("\n\n").map((para, pi) => (<p key={pi} style={{ fontSize: 15, lineHeight: 1.85, color: "#555", marginBottom: 16 }}>{para}</p>))}
            </div></div></div>))}
      </section>
      <section style={{ background: B.warm, padding: "60px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, textAlign: "center", marginBottom: 36 }}>Explore More</h2>
          <div className="ge4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {Object.entries(storyPages).filter(([k]) => k !== key).map(([k, s]) => (
              <a key={k} href={makeHref(k)} onClick={e => { e.preventDefault(); nav(k); }} style={{ ...aReset, background: s.hg, borderRadius: 12, padding: 28, color: "#fff", cursor: "pointer", transition: "transform .3s", minHeight: 140, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{s.title}</h3><p style={{ fontSize: 12, opacity: .85 }}>{s.subtitle}</p>
              </a>))}
          </div>
        </div>
      </section>
    </div>);
  };

  return (
    <div style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif", color: "#1a1a1a", background: "#fff", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Top Bar */}
      <div style={{ background: B.black, color: "#fff", fontSize: 13, padding: "8px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><TruckIcon /> Free delivery over UGX 200,000</span><button onClick={addSampleBundle} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "inherit", font: "inherit", cursor: "pointer" }}><PaletteIcon /> 5 colour samples for UGX 15,000</button></div>
          <div className="dsk" style={{ display: "flex", gap: 20, fontSize: 12 }}><span style={{ cursor: "pointer" }}>Stockists</span><span style={{ cursor: "pointer" }}>Contact Us</span><span style={{ cursor: "pointer" }}>Professionals</span></div>
        </div>
      </div>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 200, background: "#fff", boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.08)" : "none", transition: "box-shadow .3s" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <button className="mob" onClick={() => setMobMenu(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><MenuIcon /></button>
          <a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center" }}><img src={LOGO_HEADER} alt="Peacock Paints" style={{ height: 52 }} /></a>
          <nav className="dsk" style={{ display: "flex", gap: 28, alignItems: "center" }} onMouseLeave={mL}>
            {navData.map((item, i) => (<div key={i} onMouseEnter={() => mE(i)}><span className={`nl ${activeMenu === i ? "a" : ""}`} style={{ display: "flex", alignItems: "center", gap: 4 }}>{item.label} <ChevDown /></span></div>))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><SearchIcon /></button>
            <button className="dsk" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><UserIcon /></button>
            <button onClick={() => setCartOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, position: "relative" }}><CartIcon />
              {cartCount > 0 && <span style={{ position: "absolute", top: -4, right: -6, background: B.coral, color: "#fff", fontSize: 10, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>{cartCount}</span>}
            </button>
          </div>
        </div>
        {activeMenu !== null && (
          <div className="mega dsk" onMouseEnter={() => clearTimeout(mRef.current)} onMouseLeave={mL}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: navData[activeMenu].columns.map(c => c.type === "promo" ? "1.2fr" : "1fr").join(" "), gap: 32 }}>
              {navData[activeMenu].columns.map((col, ci) => (<div key={ci}>
                {col.type === "promo" ? (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {col.items.map((pr, pi) => (<a key={pi} href={pr.page ? makeHref(pr.page) : undefined} onClick={e => { e.preventDefault(); if (pr.page) nav(pr.page); }} className="pc" style={{ ...aReset, display: "block", background: pr.bg, color: pr.dark ? "#fff" : "#1a1a1a" }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{pr.title}</h4>
                    <p style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 10, opacity: .85 }}>{pr.desc}</p>
                    <span style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>{pr.cta} <Arr /></span>
                  </a>))}</div>) : col.title === "By Colours" ? (<div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: B.coral, marginBottom: 14 }}>{col.title}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    {col.links.map((l, li) => {
                      const catData = COLOUR_CATEGORIES[l];
                      const isLinked = !!catData;
                      return (
                        <a key={li} href={isLinked ? makeHref(catData.slug) : undefined} onClick={e => { e.preventDefault(); if (isLinked) nav(catData.slug); }}
                          style={{ ...aReset, display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", borderRadius: 8, cursor: isLinked ? "pointer" : "default", transition: "background .18s" }}
                          onMouseEnter={e => { if (isLinked) e.currentTarget.style.background = "#f3f1ee"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: CAT_SWATCH_COLORS[l] || "#ddd", border: "2px solid rgba(0,0,0,.09)", flexShrink: 0, boxShadow: "inset 0 1px 2px rgba(255,255,255,.5)" }} />
                          <div>
                            <span style={{ fontSize: 13, color: isLinked ? "#2a2a2a" : "#aaa", fontWeight: isLinked ? 500 : 400, display: "block", lineHeight: 1.2 }}>{l}</span>
                            {isLinked && <span style={{ fontSize: 10, color: "#aaa" }}>{COLOUR_CATEGORIES[l].colors.length} shades</span>}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                  {col.footer && <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #e8e8e8" }}>{col.footer.map((f, fi) => (<button key={fi} className="ml" onClick={() => handleMegaFooter(f.label)} style={{ fontWeight: 600, color: B.coral, border: "none", background: "none", fontFamily: "inherit", width: "100%", textAlign: "left" }}>{f.label}</button>))}</div>}
                </div>) : (<div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: B.coral, marginBottom: 14 }}>{col.title}</h3>
                  {col.links.map((l, li) => {
                    const pageMap = {"Bedroom": "bedroom-inspiration", "Living Room": "livingroom-inspiration", "Dining Room": "diningroom-inspiration", "Kitchen": "kitchen-inspiration", "Bathroom": "bathroom-inspiration", "Whites": "whites-colour", "Creams": "creams-colour", "Neutrals": "neutrals-colour", "Pinks": "pinks-colour", "Yellows": "yellows-colour", "Greens": "greens-colour", "Blues": "blues-colour", "Greys": "greys-colour", "Metallics": "metallics-colour", "Contemporary": "contemporary-style", "Modern": "modern-style", "Boho": "boho-style", "Farmhouse": "farmhouse-style", "Scandi": "scandi-style", "Eclectic": "eclectic-style", "Interior Paint": "interior-paint", "Exterior Paint": "exterior-paint"};
                    const isFinishLink = col.title === "By Finish";
                    const isPageLink = !!pageMap[l];
                    const linkedProduct = PRODUCTS.find(p => p.name === l);
                    const isClickable = isFinishLink || isPageLink || !!linkedProduct;
                    const linkHref = isPageLink ? makeHref(pageMap[l]) : linkedProduct ? productHref(linkedProduct) : undefined;
                    return (<a key={li} href={linkHref} className="ml" onClick={e => {
                      e.preventDefault();
                      if (isFinishLink) { setFinishFilter(l); setProdTab("all"); setPg("home"); setSelectedProduct(null); setActiveMenu(null); setMobMenu(false); setMobSub(null); scrollToProdPending.current = true; }
                      else if (isPageLink) { nav(pageMap[l]); }
                      else if (linkedProduct) { openProduct(linkedProduct); }
                    }} style={{ ...aReset, cursor: isClickable ? "pointer" : "default", color: isFinishLink ? B.black : undefined }}>{l}</a>);
                  })}
                  {col.footer && <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #e8e8e8" }}>{col.footer.map((f, fi) => (<button key={fi} className="ml" onClick={() => handleMegaFooter(f.label)} style={{ fontWeight: 600, color: B.coral, border: "none", background: "none", fontFamily: "inherit", width: "100%", textAlign: "left" }}>{f.label}</button>))}</div>}
                </div>)}
              </div>))}
            </div>
          </div>
        )}
      </header>

      {/* Search */}
      {searchOpen && (<div className="so" onClick={() => setSearchOpen(false)}><div style={{ background: "#fff", borderRadius: 8, padding: 32, width: 600, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h3 style={{ fontSize: 18, fontWeight: 600 }}>Search</h3><button onClick={() => setSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><CloseIcon /></button></div>
        <input className="si" placeholder="Search colours, paints, inspiration..." autoFocus />
      </div></div>)}

      {/* Cart Drawer */}
      {cartOpen && (<>
        <div className="mo" onClick={() => setCartOpen(false)} />
        <div className="cart-drawer">
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>Your Cart ({cartCount})</h3>
            <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><CloseIcon /></button>
          </div>
          {cart.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: .3 }}>🛒</div>
              <p style={{ fontSize: 15, color: "#999" }}>Your cart is empty</p>
              <button onClick={() => setCartOpen(false)} className="btn bp" style={{ marginTop: 20 }}>Continue Shopping</button>
            </div>
          ) : (<>
            <div style={{ padding: "16px 24px", flex: 1 }}>
              {cart.map((item, i) => {
                const colourData = item.colour ? trendingColours.find(c => c.name === item.colour) : null;
                return (
                <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ width: 64, height: 64, background: B.off, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                    {item.product.img ? <img src={item.product.img} alt="" style={{ maxHeight: 54, maxWidth: 54, objectFit: "contain" }} /> : <div style={{ width: 48, height: 48, borderRadius: 8, background: colourData?.color || B.coral, border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,.12)" }} />}
                    {colourData && <div style={{ position: "absolute", bottom: -4, right: -4, width: 22, height: 22, borderRadius: "50%", background: colourData.color, border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.product.name}</h4>
                    {item.colour && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        {colourData && <div style={{ width: 14, height: 14, borderRadius: "50%", background: colourData.color, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />}
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>{item.colour}</span>
                      </div>
                    )}
                    <p style={{ fontSize: 12, color: "#999" }}>{item.size} × {item.qty}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: B.coral, marginTop: 4 }}>{fmtP(item.price * item.qty)}</p>
                  </div>
                  <button onClick={() => removeFromCart(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 18, alignSelf: "flex-start" }}>×</button>
                </div>
              );})}
            </div>
            <div style={{ padding: "20px 24px", borderTop: "2px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: B.coral }}>{fmtP(cartTotal)}</span>
              </div>
              {cartTotal >= 200000 && <p style={{ fontSize: 13, color: B.teal, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><TruckIcon /> Free delivery included!</p>}
              <button className="btn bp" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15 }}>Proceed to Checkout</button>
            </div>
          </>)}
        </div>
      </>)}

      {/* Mobile Menu */}
      {mobMenu && (<>
        <div className="mo" onClick={() => { setMobMenu(false); setMobSub(null); }} />
        <div className="md">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #eee" }}>
            {mobSub !== null ? (<><span style={{ fontWeight: 600 }}>{navData[mobSub].label}</span><button onClick={() => setMobSub(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: B.coral, fontWeight: 600 }}>Back</button></>) : (<><img src={LOGO_HEADER} alt="" style={{ height: 36 }} /><button onClick={() => { setMobMenu(false); setMobSub(null); }} style={{ background: "none", border: "none", cursor: "pointer" }}><CloseIcon /></button></>)}
          </div>
          {mobSub === null ? (<div>{navData.map((item, i) => (<div key={i} onClick={() => setMobSub(i)} style={{ padding: "14px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}><span style={{ fontWeight: 500 }}>{item.label}</span><ChevRight /></div>))}</div>) : (<div>
            {navData[mobSub].columns.filter(c => c.type !== "promo").map((col, ci) => (<div key={ci} style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: B.coral, marginBottom: 12 }}>{col.title}</h4>
              {col.links && col.links.map((l, li) => {
                const pageMap = {"Bedroom": "bedroom-inspiration", "Whites": "whites-colour", "Creams": "creams-colour", "Neutrals": "neutrals-colour", "Pinks": "pinks-colour", "Yellows": "yellows-colour", "Greens": "greens-colour", "Blues": "blues-colour", "Greys": "greys-colour", "Metallics": "metallics-colour"};
                const isFinishLink = col.title === "By Finish";
                const isPageLink = !!pageMap[l];
                const linkedProduct = PRODUCTS.find(p => p.name === l);
                const isClickable = isFinishLink || isPageLink || !!linkedProduct;
                const mobLinkHref = isPageLink ? makeHref(pageMap[l]) : linkedProduct ? productHref(linkedProduct) : undefined;
                return (<a key={li} href={mobLinkHref} onClick={e => {
                  e.preventDefault();
                  if (isFinishLink) { setFinishFilter(l); setProdTab("all"); setPg("home"); setSelectedProduct(null); setActiveMenu(null); setMobMenu(false); setMobSub(null); scrollToProdPending.current = true; }
                  else if (isPageLink) { nav(pageMap[l]); }
                  else if (linkedProduct) { openProduct(linkedProduct); }
                }} style={{ ...aReset, padding: "8px 0", fontSize: 14, color: isClickable ? B.coral : "#444", cursor: isClickable ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {l}{isClickable && !isFinishLink && <ChevRight />}
                </a>);
              })}
            </div>))}
          </div>)}
        </div>
      </>)}

      {/* ═══ PAGES ═══ */}
      {pg === "interior-paint" ? (
        <PaintCategoryPage category="interior" title="Interior Paints" subtitle="Premium interior paints for every room — from smooth matts to washable silks and high-gloss finishes." onOpenProduct={openProduct} productHrefFn={productHref} homeHref={makeHref("home")} nav={nav} />
      ) : pg === "exterior-paint" ? (
        <PaintCategoryPage category="exterior" title="Exterior Paints" subtitle="Durable exterior coatings engineered for East Africa's climate — protecting and beautifying your building for years." onOpenProduct={openProduct} productHrefFn={productHref} homeHref={makeHref("home")} nav={nav} />
      ) : pg === "product" && selectedProduct ? (
        <ProductDetailPage product={selectedProduct} onBack={() => nav("home")} onAddToCart={addToCart} onOpenProduct={openProduct} />
      ) : pg === "bedroom-inspiration" ? (
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div>
        <RoomInspirationPage roomName="Bedroom" inspirations={BEDROOM_INSPIRATIONS} onBack={() => nav("home")} nav={nav} onAddSample={addSamplePot} onAddSampleBundle={addSampleBundle} /></>
      ) : pg === "livingroom-inspiration" ? (
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div>
        <RoomInspirationPage roomName="Living Room" inspirations={LIVING_ROOM_INSPIRATIONS} onBack={() => nav("home")} nav={nav} onAddSample={addSamplePot} onAddSampleBundle={addSampleBundle} /></>
      ) : pg === "diningroom-inspiration" ? (
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div>
        <RoomInspirationPage roomName="Dining Room" inspirations={DINING_ROOM_INSPIRATIONS} onBack={() => nav("home")} nav={nav} onAddSample={addSamplePot} onAddSampleBundle={addSampleBundle} /></>
      ) : pg === "kitchen-inspiration" ? (
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div>
        <RoomInspirationPage roomName="Kitchen" inspirations={KITCHEN_INSPIRATIONS} onBack={() => nav("home")} nav={nav} onAddSample={addSamplePot} onAddSampleBundle={addSampleBundle} /></>
      ) : pg === "bathroom-inspiration" ? (
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div>
        <RoomInspirationPage roomName="Bathroom" inspirations={BATHROOM_INSPIRATIONS} onBack={() => nav("home")} nav={nav} onAddSample={addSamplePot} onAddSampleBundle={addSampleBundle} /></>
      ) : pg === "colour-detail" && selectedColour ? (
        <ColourDetailPage
          colour={selectedColour}
          categoryName={selectedColourCategory || selectedColourStyle}
          onBack={() => {
            const d = COLOUR_CATEGORIES[selectedColourCategory];
            if (d) { nav(d.slug); return; }
            const s = STYLE_CATEGORIES[selectedColourStyle];
            if (s) { nav(s.slug); return; }
            nav("home");
          }}
          onBackHome={() => nav("home")}
          onAddToCart={addToCart}
          onAddSample={addSamplePot}
          homeHref={makeHref("home")}
          backHref={(() => { const d = COLOUR_CATEGORIES[selectedColourCategory]; if (d) return makeHref(d.slug); const s = STYLE_CATEGORIES[selectedColourStyle]; if (s) return makeHref(s.slug); return makeHref("home"); })()}
        />
      ) : pg === "all-colours" ? (
        <ColourCategoryPage
          categoryName="colours"
          categoryData={{ slug: "all-colours", desc: "Every Peacock shade in one place.", colors: trendingColours.map(c => c.name), gradient: "linear-gradient(135deg, #fffaf0, #f3e7d3)", accent: B.coral }}
          allColours={trendingColours}
          onBack={() => nav("home")}
          onNavCategory={(name) => { const d = COLOUR_CATEGORIES[name]; if (d) nav(d.slug); }}
          onOpenColour={handleColourClick}
          onAddSample={addSamplePot}
          onAddSampleBundle={addSampleBundle}
          onViewAllColours={() => nav("all-colours")}
          homeHref={makeHref("home")}
          colourHrefFn={colourHref}
          catHrefFn={(name, data) => makeHref(data.slug)}
        />
      ) : currentColourCatName ? (
        <ColourCategoryPage
          categoryName={currentColourCatName}
          categoryData={COLOUR_CATEGORIES[currentColourCatName]}
          allColours={trendingColours}
          onBack={() => nav("home")}
          onNavCategory={(name) => { const d = COLOUR_CATEGORIES[name]; if (d) nav(d.slug); }}
          onOpenColour={(c) => { setSelectedColour(c); setSelectedColourCategory(currentColourCatName); nav("colour-detail"); }}
          onAddSample={addSamplePot}
          onAddSampleBundle={addSampleBundle}
          onViewAllColours={() => nav("all-colours")}
          homeHref={makeHref("home")}
          colourHrefFn={colourHref}
          catHrefFn={(name, data) => makeHref(data.slug)}
        />
      ) : currentStyleName ? (
        <StyleCategoryPage
          styleName={currentStyleName}
          styleData={STYLE_CATEGORIES[currentStyleName]}
          allColours={trendingColours}
          onBack={() => nav("home")}
          onNavStyle={(name) => { const d = STYLE_CATEGORIES[name]; if (d) nav(d.slug); }}
          onOpenColour={(c) => { setSelectedColour(c); setSelectedColourStyle(currentStyleName); setSelectedColourCategory(null); nav("colour-detail"); }}
          onAddSample={addSamplePot}
          onAddSampleBundle={addSampleBundle}
          onViewAllColours={() => nav("all-colours")}
          homeHref={makeHref("home")}
          colourHrefFn={colourHref}
          styleHrefFn={(name, data) => makeHref(data.slug)}
        />
      ) : pg !== "home" && storyPages[pg] ? (
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div>{renderStory(pg)}</>
      ) : (<>
        {/* Hero */}
        <section
          className="paint-hero"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
          onFocus={() => setHeroPaused(true)}
          onBlur={() => setHeroPaused(false)}
          style={{ "--hero-accent": currentHero.accent }}
        >
          <div className="paint-hero-shell">
            <div className="paint-hero-copy">
              <div className="paint-hero-kicker"><span />{currentHero.eyebrow}</div>
              <h1 className="paint-hero-title">{currentHero.title}</h1>
              <p>{currentHero.copy}</p>
              <div className="paint-hero-actions">
                <button className="paint-hero-action" onClick={shopHeroProducts}>Shop paints <Arr /></button>
                <button className="paint-hero-action secondary" onClick={exploreHero}>{currentHero.cta2} <Arr /></button>
              </div>
              <div className="paint-hero-proof" aria-label="Peacock Paints highlights">
                <div><strong>1962</strong><span>The Painters' Paint</span></div>
                <div><strong>{trendingColours.length}</strong><span>colour shades</span></div>
                <div><strong>5</strong><span>sample pots bundle</span></div>
              </div>
            </div>

            <div className="paint-hero-visual" aria-label={`${currentHero.note} room inspiration`}>
              <img className="paint-hero-room" src={currentHero.roomImg} alt={`${currentHero.note} painted with Peacock colours`} />
              <div className="paint-hero-swatches">
                {currentHero.swatches.map(s => (
                  <button key={s.name} className="paint-hero-swatch" title={s.name} aria-label={`View ${s.name} colour`} onClick={() => openHeroSwatch(s)} style={{ background: s.color }} />
                ))}
              </div>
            </div>
          </div>

          <div className="paint-hero-switcher">
            <button className="paint-hero-nav" onClick={() => showHeroSlide(heroSlide - 1)} aria-label="Previous hero slide"><ArrL /></button>
            {heroSlides.map((sl, i) => (
              <button key={sl.eyebrow} className={`paint-hero-dot ${heroSlide === i ? "active" : ""}`} onClick={() => showHeroSlide(i)} aria-label={`Show ${sl.eyebrow}`} />
            ))}
            <button className="paint-hero-nav" onClick={() => showHeroSlide(heroSlide + 1)} aria-label="Next hero slide"><Arr /></button>
          </div>
        </section>

        <section className="doors" aria-label="Shop for the home or for site teams">
          <div className="doors-grid">
            <button className="doors-home" onClick={() => nav("bedroom-inspiration")}>
              <img src={INSPO_SCANDI_SAGE} alt="Sage bedroom with a wood bed, linen, and morning light" />
              <span className="doors-home-shade" aria-hidden="true" />
              <span className="doors-home-copy">
                <strong>For the home.</strong>
                <span>Find interior paints and colours that work with the light in every room.</span>
              </span>
            </button>
            <div className="doors-side">
              <button className="doors-trade" onClick={() => nav("exterior-paint")}>
                <span>
                  <strong>For site teams.</strong>
                  <span className="doors-trade-copy">Specify exterior, industrial, and trade finishes built for the job.</span>
                </span>
                <span className="doors-trade-go">Exterior paints <Arr /></span>
              </button>
              <button className="doors-tin" onClick={() => openProduct(weathershield)}>
                <img src={IMG_WEATHER} alt="" />
                <span>
                  <strong>Weathershield</strong>
                  <span>Grade 1 exterior matt. From {fmtP(weathershield.sizes[0].price)}</span>
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Trending Colours */}
        <section style={{ background: B.off, padding: "60px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <h2 className="st">Our trending colours</h2>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button className="btn bd dsk" onClick={() => nav("all-colours")}>Shop all colours</button>
                {/* Prev arrow */}
                <button
                  onClick={() => setColourCarouselIdx(i => Math.max(0, i - 1))}
                  disabled={colourCarouselIdx === 0}
                  style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #ddd", background: colourCarouselIdx === 0 ? "#f5f5f5" : "#fff", cursor: colourCarouselIdx === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: colourCarouselIdx === 0 ? "#ccc" : "#333", transition: "all .2s", flexShrink: 0 }}>
                  <ArrL />
                </button>
                {/* Next arrow */}
                <button
                  onClick={() => setColourCarouselIdx(i => Math.min(trendingColours.length - CARDS_VISIBLE, i + 1))}
                  disabled={colourCarouselIdx >= trendingColours.length - CARDS_VISIBLE}
                  style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #1a1a1a", background: colourCarouselIdx >= trendingColours.length - CARDS_VISIBLE ? "#f5f5f5" : "#1a1a1a", cursor: colourCarouselIdx >= trendingColours.length - CARDS_VISIBLE ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: colourCarouselIdx >= trendingColours.length - CARDS_VISIBLE ? "#ccc" : "#fff", transition: "all .2s", flexShrink: 0 }}>
                  <Arr />
                </button>
              </div>
            </div>
            {/* Cards grid — 5 visible */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
              {trendingColours.slice(colourCarouselIdx, colourCarouselIdx + CARDS_VISIBLE).map((c, i) => (
                <a key={colourCarouselIdx + i} href={colourHref(c)}
                  onClick={e => { e.preventDefault(); handleColourClick(c); }}
                  style={{ ...aReset, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "transform .3s, box-shadow .3s", display: "flex", flexDirection: "column", background: c.color }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-7px)"; e.currentTarget.style.boxShadow = "0 24px 52px rgba(0,0,0,.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  {/* Swatch area */}
                  <div style={{ padding: "28px 20px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "80%", aspectRatio: "1 / 1", filter: "drop-shadow(0 8px 20px rgba(0,0,0,.22))" }}>
                      <PaintBlob color={c.color} v={i} />
                    </div>
                  </div>
                  {/* Info bar */}
                  <div style={{ padding: "14px 16px 16px", background: "rgba(0,0,0,.18)" }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2, textShadow: "0 1px 4px rgba(0,0,0,.3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}®</h4>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,.75)", marginBottom: 12, lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.desc}</p>
                    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                      <button onClick={e => { e.stopPropagation(); e.preventDefault(); handleColourClick(c); }} style={{ flex: 1, padding: "7px 0", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", letterSpacing: .3 }}>Shop</button>
                      <button onClick={e => { e.stopPropagation(); e.preventDefault(); addSamplePot(c.name); }} style={{ flex: 1, padding: "7px 0", background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.65)", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>+ Sample</button>
                      <button onClick={e => { e.stopPropagation(); e.preventDefault(); handleColourClick(c); }} style={{ width: 30, height: 30, background: "rgba(255,255,255,.2)", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}><Arr /></button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            {/* Progress indicator */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 24 }}>
              {Array.from({ length: Math.ceil(trendingColours.length / CARDS_VISIBLE) }).map((_, i) => {
                const isActive = Math.floor(colourCarouselIdx / CARDS_VISIBLE) === i;
                return <button key={i} onClick={() => setColourCarouselIdx(i * CARDS_VISIBLE)} style={{ width: isActive ? 24 : 8, height: 8, borderRadius: 4, background: isActive ? "#1a1a1a" : "#ccc", border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }} />;
              })}
            </div>
          </div>
        </section>

        {/* ═══ FULL PRODUCT CATALOGUE ═══ */}
        <section ref={prodSectionRef} style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ marginBottom: 32 }}>
            <h2 className="st" style={{ marginBottom: 8 }}>Our complete product range</h2>
            <p style={{ fontSize: 15, color: "#666" }}>Click any product for full details, size options, and ordering</p>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: finishFilter ? 16 : 32, flexWrap: "wrap" }}>
            {[{ k: "all", l: `All (${PRODUCTS.length})` },{ k: "interior", l: `Interior (${PRODUCTS.filter(p=>p.category==="interior").length})` },{ k: "exterior", l: `Exterior (${PRODUCTS.filter(p=>p.category==="exterior").length})` },{ k: "specialist", l: `Specialist (${PRODUCTS.filter(p=>p.category==="specialist").length})` }].map(t => (
              <button key={t.k} className={`tab ${prodTab === t.k ? "ta" : "ti"}`} onClick={() => { setProdTab(t.k); setFinishFilter(null); }}>{t.l}</button>
            ))}
          </div>
          {finishFilter && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <span style={{ fontSize: 13, color: "#888" }}>Filtered by finish:</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: B.coral, color: "#fff", padding: "6px 14px 6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                {finishFilter}
                <span onClick={() => setFinishFilter(null)} style={{ cursor: "pointer", fontSize: 16, lineHeight: 1, opacity: .85, marginLeft: 2 }} title="Clear filter">×</span>
              </span>
              <span style={{ fontSize: 13, color: "#aaa" }}>({filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""})</span>
            </div>
          )}
          <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {filteredProducts.map(p => (
              <a key={p.id} href={productHref(p)} onClick={e => { e.preventDefault(); openProduct(p); }} style={{ ...aReset, display: "block", background: "#fff", borderRadius: 12, border: "1px solid #eee", overflow: "hidden", cursor: "pointer", transition: "transform .3s, box-shadow .3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.1)"; }} onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                <div style={{ background: B.off, padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "center", height: 200, position: "relative" }}>
                  {p.img && <img src={p.img} alt={p.name} style={{ maxHeight: 170, maxWidth: "80%", objectFit: "contain", filter: "drop-shadow(0 6px 12px rgba(0,0,0,.12))" }} />}
                  {p.tag && <span style={{ position: "absolute", top: 10, left: 10, background: p.tag === "Best Seller" ? B.coral : p.tag === "New" ? B.teal : p.tag === "Specialist" ? B.gold : "#5C2D6D", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>{p.tag}</span>}
                  {p.grade && <span style={{ position: "absolute", top: 10, right: 10, background: "#fff", border: `2px solid ${B.coral}`, color: B.coral, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>G{p.grade}</span>}
                </div>
                <div style={{ padding: "16px 18px 18px" }}>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{p.name}</h4>
                  <p style={{ fontSize: 12, color: "#777", lineHeight: 1.4, marginBottom: 10, minHeight: 34 }}>{p.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: B.coral }}>From {fmtP(p.sizes[0].price)}</span>
                    <span style={{ fontSize: 12, color: "#999" }}>{p.sizes.map(s => s.size).join(" • ")}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section style={{ background: `linear-gradient(135deg, ${B.coral}, ${B.coralDk})`, padding: "60px 0" }}>
          <div className="g2" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div style={{ color: "#fff" }}><h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 600, marginBottom: 12 }}>Inspiration in your inbox</h2><p style={{ fontSize: 15, opacity: .9, lineHeight: 1.6 }}>Latest colour trends + 10% off your first purchase</p></div>
            <div style={{ display: "flex", gap: 12 }}><input type="email" placeholder="Email Address" style={{ flex: 1, padding: "14px 18px", borderRadius: 6, border: "none", fontSize: 15, fontFamily: "'Outfit',sans-serif", outline: "none" }} /><button className="btn" style={{ background: B.black, color: "#fff" }}>Sign Up</button></div>
          </div>
        </section>

        {/* Info Cards */}
        <section style={{ background: B.off, padding: "60px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <h2 className="st" style={{ marginBottom: 36 }}>We're here for you</h2>
            <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {[{ t: "Inspiration", d: "Design trends for 2026", c: "Discover", bg: `linear-gradient(135deg,${B.teal}90,${B.tealDk})` },{ t: "How To Guides", d: "Expert tips for perfect results", c: "Tips", bg: `linear-gradient(135deg,${B.coral}90,${B.coralDk})` },{ t: "Visit Us", d: "Find a Peacock stockist", c: "Find store", bg: `linear-gradient(135deg,${B.gold}90,#C89820)` }].map((c, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: "hidden", transition: "transform .3s", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                  <div style={{ background: c.bg, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 44, opacity: .4, color: "#fff" }}>{["🎨","🖌️","📍"][i]}</span></div>
                  <div style={{ padding: 20, background: "#fff" }}><h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{c.t}</h3><p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>{c.d}</p><span style={{ fontSize: 13, fontWeight: 600, color: B.coral, display: "flex", alignItems: "center", gap: 4 }}>{c.c} <Arr /></span></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>)}

      {/* Footer */}
      <footer style={{ background: B.black, color: "#fff", padding: "60px 0 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="g5" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.5fr", gap: 40, paddingBottom: 40 }}>
            <div><div style={{ marginBottom: 20 }}><img src={LOGO_FOOTER} alt="" style={{ height: 50, filter: "invert(1)", mixBlendMode: "screen", opacity: .9 }} /></div><p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>The Painters' Paint. Premium paints for every room, surface, and style.</p></div>
            <div className="fc"><h4>Shop</h4><span onClick={() => nav("all-colours")}>Colours</span><span>Paint</span><span onClick={() => nav("bedroom-inspiration")}>Inspiration</span></div>
            <div className="fc"><h4>Company</h4><a href={makeHref("about")} onClick={e => { e.preventDefault(); nav("about"); }} style={aReset}>About Us</a><a href={makeHref("sustainability")} onClick={e => { e.preventDefault(); nav("sustainability"); }} style={aReset}>Sustainability</a><a href={makeHref("community")} onClick={e => { e.preventDefault(); nav("community"); }} style={aReset}>Community</a><a href={makeHref("foundation")} onClick={e => { e.preventDefault(); nav("foundation"); }} style={aReset}>Foundation</a></div>
            <div className="fc"><h4>Support</h4><span>Help & FAQs</span><span>Find Stockist</span><span>Delivery</span><span>Returns</span></div>
            <div className="fc"><h4>Contact</h4><p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.6, marginBottom: 16 }}>Questions? We're here to help.</p><p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 12 }}>Mon–Fri: 8:00–17:00</p><div style={{ display: "flex", gap: 16 }}><span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,.7)", cursor: "pointer" }}><PhoneIcon /> Call</span><span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,.7)", cursor: "pointer" }}><MailIcon /> Email</span></div></div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", gap: 20, fontSize: 12, color: "rgba(255,255,255,.4)" }}><span>Privacy</span><span>Terms</span><span>Cookies</span></div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>©2026 Peacock Paints Limited — The Painters' Paint</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
