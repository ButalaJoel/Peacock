import { B } from "../data/theme.js";
import { CAT_SWATCH_COLORS, COLOUR_CATEGORIES } from "../data/colours.js";
import PaintBlob from "../components/common/PaintBlob.jsx";

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

export default ColourCategoryPage;
