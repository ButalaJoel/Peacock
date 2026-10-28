import { B } from "../../data/theme.js";
import { PRODUCTS } from "../../data/products.js";
import { useApp } from "../../context/AppContext.jsx";

export default function ProductCatalogue() {
  const { prodTab, setProdTab, finishFilter, setFinishFilter, prodSectionRef, openProduct, productHref, aReset, filteredProducts } = useApp();
  return (
    <>
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
                    <span style={{ fontSize: 13, fontWeight: 600, color: B.coral }}>View details</span>
                    <span style={{ fontSize: 12, color: "#999" }}>{p.sizes.map(s => s.size).join(" • ")}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
    </>
  );
}
