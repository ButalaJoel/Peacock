import { B } from "../data/theme.js";
import { PRODUCTS } from "../data/products.js";
import { ArrL } from "../components/icons/Icons.jsx";

const PaintCategoryPage = ({ category, title, subtitle, onOpenProduct, productHrefFn, homeHref, nav }) => {
  const products = PRODUCTS.filter(p => p.category === category);
  
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
                  <span style={{ fontSize: 13, fontWeight: 600, color: B.coral }}>View details</span>
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

export default PaintCategoryPage;
