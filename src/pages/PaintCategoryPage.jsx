import { useState } from "react";
import { B } from "../data/theme.js";
import { PRODUCTS, CATEGORIES, CATEGORY_PAGES } from "../data/products.js";
import { ArrL, Arr } from "../components/icons/Icons.jsx";

const PAGE_SIZE = 12;
const HERO = {
  decorative: "linear-gradient(135deg, " + B.coral + "ee, " + B.coralDk + ")",
  industrial: "linear-gradient(135deg, #2f3a40, #151a1d)",
  woodcare: "linear-gradient(135deg, #b8862a, #7a5418)",
  thinners: "linear-gradient(135deg, " + B.teal + "ee, " + B.tealDk + ")",
};

const PaintCategoryPage = ({ slug, onOpenProduct, productHrefFn, homeHref, nav }) => {
  const [page, setPage] = useState(1);
  const info = CATEGORY_PAGES[slug];
  if (!info) return null;

  const cat = CATEGORIES[info.category];
  const sub = info.sub ? cat.subcategories.find(s => s.id === info.sub) : null;
  const inCategory = PRODUCTS.filter(p => p.category === info.category);
  const products = inCategory.filter(p => !info.sub || p.subcategories.includes(info.sub));
  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = products.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const goTo = n => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const chips = cat.subcategories.length
    ? [{ label: "All", slug: cat.slug, count: inCategory.length }].concat(
        cat.subcategories
          .map(s => ({ label: s.label, slug: cat.slug + "-" + s.id, count: inCategory.filter(p => p.subcategories.includes(s.id)).length }))
          .filter(c => c.count > 0)
      )
    : [];

  const pageButton = (active, disabled) => ({
    minWidth: 40, height: 40, padding: "0 12px", borderRadius: 8, cursor: disabled ? "default" : "pointer",
    border: "1px solid " + (active ? B.coral : "#ddd"), background: active ? B.coral : "#fff",
    color: active ? "#fff" : disabled ? "#bbb" : "#333", fontWeight: 600, fontSize: 14, fontFamily: "inherit",
  });

  return (
    <div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}>
        <a href={homeHref} onClick={e => { e.preventDefault(); nav("home"); }} style={{ textDecoration: "none", color: B.coral, fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a>
      </div>

      <div style={{ background: HERO[info.category] || HERO.decorative, padding: "60px 24px", color: "#fff", textAlign: "center" }}>
        <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, opacity: .8, marginBottom: 12, fontWeight: 600 }}>{sub ? "Paints / " + cat.label : "Paints"}</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 600, marginBottom: 16 }}>{sub ? sub.label : cat.label}</h1>
        <p style={{ fontSize: 16, opacity: .9, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>{cat.tagline}</p>
      </div>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 60px" }}>
        {chips.length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
            {chips.map(c => {
              const active = c.slug === slug;
              return (
                <button key={c.slug} onClick={() => nav(c.slug)} style={{ padding: "10px 20px", borderRadius: 24, border: "2px solid " + (active ? B.coral : "#ddd"), background: active ? B.coral : "transparent", color: active ? "#fff" : "#555", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                  {c.label} ({c.count})
                </button>
              );
            })}
          </div>
        )}

        <p style={{ fontSize: 15, color: "#666", marginBottom: 28 }}>
          {products.length} {products.length === 1 ? "product" : "products"}
          {pageCount > 1 ? " - page " + current + " of " + pageCount : ""}
        </p>

        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {visible.map(p => (
            <a key={p.id} href={productHrefFn(p)} onClick={e => { e.preventDefault(); onOpenProduct(p); }}
              style={{ textDecoration: "none", color: "inherit", display: "block", background: "#fff", borderRadius: 12, border: "1px solid #eee", overflow: "hidden", cursor: "pointer", transition: "transform .3s, box-shadow .3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={{ background: "#fff", padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "center", height: 220, borderBottom: "1px solid #f3f1ee" }}>
                {p.img
                  ? <img src={p.img} alt={p.name} loading="lazy" style={{ maxHeight: 190, maxWidth: "85%", objectFit: "contain" }} />
                  : <span style={{ fontSize: 12, color: "#bbb" }}>Image coming soon</span>}
              </div>
              <div style={{ padding: "16px 18px 18px" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{p.name}</h4>
                {p.subtitle && <p style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>{p.subtitle}</p>}
                <p style={{ fontSize: 12, color: "#777", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 54 }}>{p.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: B.coral }}>View details</span>
                  <span style={{ fontSize: 12, color: "#999", textAlign: "right" }}>{p.packSizes.slice(0, 3).join(" \u2022 ")}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {pageCount > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 40, flexWrap: "wrap" }}>
            <button disabled={current === 1} onClick={() => goTo(current - 1)} style={pageButton(false, current === 1)}><ArrL /></button>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button key={i} onClick={() => goTo(i + 1)} style={pageButton(current === i + 1, false)}>{i + 1}</button>
            ))}
            <button disabled={current === pageCount} onClick={() => goTo(current + 1)} style={pageButton(false, current === pageCount)}><Arr /></button>
          </div>
        )}
      </section>
    </div>
  );
};

export default PaintCategoryPage;
