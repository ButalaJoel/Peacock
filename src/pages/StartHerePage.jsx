import { useApp } from "../context/useApp.js";
import { PRODUCTS } from "../data/products.js";
import { GUIDE } from "../data/startGuide.js";
import { B } from "../data/theme.js";
import PageHero from "../components/common/PageHero.jsx";

const STEPS = [
  ["1", "Pick the surface", "Walls, floors, wood or metal. Choose what you are painting."],
  ["2", "See what we recommend", "Each surface shows the Peacock paints made for it."],
  ["3", "Choose a colour and ask for a quote", "Add the paints to your quote list. Our sales team replies with a quotation."],
];

function ProductCard({ p }) {
  const { openProduct, addToCart } = useApp();
  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <button onClick={() => openProduct(p)} aria-label={"View " + p.name} style={{ background: "#f8f6f2", border: "none", height: 170, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
        {p.img ? <img src={p.img} alt={p.name} style={{ maxHeight: 146, maxWidth: "100%", objectFit: "contain" }} /> : <span style={{ color: "#999", fontSize: 13 }}>{p.name}</span>}
      </button>
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</h3>
        <p style={{ fontSize: 13, color: "#666", lineHeight: 1.55, flex: 1 }}>{p.desc}</p>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => openProduct(p)} style={{ background: "none", border: "none", color: B.coral, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 13, padding: 0 }}>View details</button>
          <button onClick={() => addToCart({ product: p, size: (p.packSizes && p.packSizes[0]) || (p.sizes && p.sizes[0] && p.sizes[0].size), qty: 1, colour: null })} style={{ background: "none", border: "1px solid #ddd", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 600 }}>Add to quote list</button>
        </div>
      </div>
    </div>
  );
}

export default function StartHerePage() {
  const { nav, makeHref } = useApp();
  const go = (e, page) => { e.preventDefault(); nav(page); };
  const jump = id => { const el = document.getElementById("guide-" + id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <div>
      <PageHero kicker="New to Peacock Paints?" title="Where do I start?" subtitle="Tell us what you are painting and we will show you the paints made for it." gradient="linear-gradient(135deg, #2d4a3e, #1a3a5c 50%, #5c2d6d)" />

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 24px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {STEPS.map(s => (
            <div key={s[0]} style={{ background: "#faf8f5", borderRadius: 14, padding: "18px 20px" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: B.coral, fontWeight: 700 }}>{s[0]}</span>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: "4px 0 6px" }}>{s[1]}</h3>
              <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6 }}>{s[2]}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "30px 0 4px" }} role="navigation" aria-label="Surfaces">
          {GUIDE.map(g => (
            <button key={g.id} onClick={() => jump(g.id)} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 24, padding: "9px 18px", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 500 }}>{g.title}</button>
          ))}
        </div>
      </section>

      {GUIDE.map(g => {
        const items = g.picks.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
        if (!items.length) return null;
        return (
          <section key={g.id} id={"guide-" + g.id} style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 8px", scrollMarginTop: 110 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 4 }}>{g.title}</h2>
            <p style={{ fontSize: 15, color: "#777", marginBottom: 18 }}>{g.intro}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 18 }}>
              {items.map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>
        );
      })}

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 70px" }}>
        <div style={{ background: "#1a1a1a", color: "#fff", borderRadius: 16, padding: "32px 28px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Not sure which one fits your job?</h2>
          <p style={{ fontSize: 15, opacity: 0.8, marginBottom: 20 }}>Pick your colour, or ask our team. We reply to every request.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn bp" href={makeHref("all-colours")} onClick={e => go(e, "all-colours")} style={{ textDecoration: "none" }}>Choose a colour</a>
            <a className="btn bp" href={makeHref("estimator")} onClick={e => go(e, "estimator")} style={{ textDecoration: "none" }}>How much paint do I need?</a>
            <a className="btn bp" href={makeHref("contact")} onClick={e => go(e, "contact")} style={{ textDecoration: "none" }}>Talk to our team</a>
          </div>
        </div>
      </section>
    </div>
  );
}
