import { useState } from "react";
import { useApp } from "../../context/useApp.js";
import { PRODUCTS, CATEGORIES } from "../../data/products.js";
import { trendingColours } from "../../data/colours.js";
import { CloseIcon } from "../icons/Icons.jsx";

export default function SearchModal() {
  const { searchOpen, setSearchOpen, openProduct, handleColourClick } = useApp();
  const [query, setQuery] = useState("");
  if (!searchOpen) return null;

  const q = query.trim().toLowerCase();
  const products = q
    ? PRODUCTS.filter(p => [p.name, p.subtitle, p.desc, CATEGORIES[p.category] && CATEGORIES[p.category].label].filter(Boolean).join(" ").toLowerCase().includes(q)).slice(0, 8)
    : [];
  const colours = q
    ? trendingColours.filter(c => (c.name + " " + c.desc).toLowerCase().includes(q)).slice(0, 8)
    : [];

  const close = () => { setSearchOpen(false); setQuery(""); };
  const pickProduct = p => { close(); openProduct(p); };
  const pickColour = c => { close(); handleColourClick(c); };

  const row = { display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 12px", border: "none", background: "transparent", borderRadius: 8, cursor: "pointer", textAlign: "left", fontFamily: "inherit" };
  const heading = { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#999", margin: "18px 0 6px" };

  return (
    <div className="so" onClick={close}>
      <div style={{ background: "#fff", borderRadius: 8, padding: 32, width: 600, maxWidth: "90vw", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>Search</h3>
          <button onClick={close} style={{ background: "none", border: "none", cursor: "pointer" }}><CloseIcon /></button>
        </div>
        <input className="si" placeholder="Search paints and colours..." autoFocus value={query}
          onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === "Escape") close(); }} />

        {!q && <p style={{ fontSize: 13, color: "#999", marginTop: 16 }}>Try a product name (Vinyl Silk, Epoxy, Sealer) or a colour (Ice, Mustard, Navy).</p>}
        {q && products.length === 0 && colours.length === 0 && <p style={{ fontSize: 14, color: "#777", marginTop: 20 }}>No matches for "{query}".</p>}

        {products.length > 0 && <div style={heading}>Products</div>}
        {products.map(p => (
          <button key={p.id} style={row} onClick={() => pickProduct(p)}
            onMouseEnter={e => { e.currentTarget.style.background = "#f6f4f0"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {p.img ? <img src={p.img} alt="" style={{ maxWidth: 44, maxHeight: 44, objectFit: "contain" }} /> : null}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{CATEGORIES[p.category] && CATEGORIES[p.category].label}</div>
            </div>
          </button>
        ))}

        {colours.length > 0 && <div style={heading}>Colours</div>}
        {colours.map(c => (
          <button key={c.name} style={row} onClick={() => pickColour(c)}
            onMouseEnter={e => { e.currentTarget.style.background = "#f6f4f0"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: c.color, border: "2px solid rgba(0,0,0,.08)", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{c.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
