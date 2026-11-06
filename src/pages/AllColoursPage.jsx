import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/useApp.js";
import { B } from "../data/theme.js";
import { trendingColours, COLOUR_CATEGORIES, CAT_SWATCH_COLORS } from "../data/colours.js";
import { paginate, pageList } from "../utils/paginate.js";
import PaintBlob from "../components/common/PaintBlob.jsx";

const ROWS = 4;

// 4 columns on wide screens, 2 on smaller ones, so a page is never more than 4 rows of cards.
function usePerPage() {
  const query = "(min-width: 1025px)";
  const wide = () => { try { return window.matchMedia(query).matches; } catch { return true; } };
  const [isWide, setIsWide] = useState(wide);
  useEffect(() => {
    let mq;
    try { mq = window.matchMedia(query); } catch { return undefined; }
    const on = () => setIsWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return (isWide ? 4 : 2) * ROWS;
}

export default function AllColoursPage() {
  const { nav, makeHref, handleColourClick, addSamplePot } = useApp();
  const perPage = usePerPage();
  const gridTop = useRef(null);
  const [family, setFamily] = useState("All");
  const [query, setQuery] = useState("");
  const [pageNo, setPageNo] = useState(1);

  const q = query.trim().toLowerCase();
  const inFamily = family === "All" ? trendingColours : trendingColours.filter(c => COLOUR_CATEGORIES[family].colors.includes(c.name));
  const list = q ? inFamily.filter(c => c.name.toLowerCase().includes(q) || String(c.color).toLowerCase().includes(q.replace(/^#?/, "#"))) : inFamily;
  const view = paginate(list, pageNo, perPage);

  const goTo = n => {
    setPageNo(n);
    if (gridTop.current) gridTop.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const chooseFamily = f => { setFamily(f); setPageNo(1); };
  const colourHref = c => "#/colour/" + encodeURIComponent(c.name);

  const chip = on => ({ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 30, border: "1px solid " + (on ? B.coral : "#e2e2e2"), background: on ? B.coral : "#fff", color: on ? "#fff" : "#444", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" });
  const pbtn = (on, disabled) => ({ minWidth: 40, height: 40, padding: "0 12px", borderRadius: 10, border: "1px solid " + (on ? B.coral : "#ddd"), background: on ? B.coral : "#fff", color: on ? "#fff" : disabled ? "#bbb" : "#333", fontWeight: 600, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit" });

  return (
    <div>
      <section style={{ background: "linear-gradient(135deg, #fffaf0, #f3e7d3)", padding: "64px 0 44px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, color: B.coral, fontWeight: 600, marginBottom: 12 }}>Colour Collection</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 46, fontWeight: 700, marginBottom: 14, color: "#1a1a1a" }}>All colours</h1>
          <p style={{ fontSize: 17, color: "#555", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 22px" }}>Every Peacock shade in one place.</p>
          <a href={makeHref("colour-picker")} onClick={e => { e.preventDefault(); nav("colour-picker"); }} style={{ color: B.coral, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Or find a colour from a photo</a>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 0" }}>
        <input type="search" value={query} onChange={e => { setQuery(e.target.value); setPageNo(1); }} placeholder="Search colours by name"
          aria-label="Search colours by name" style={{ width: "100%", maxWidth: 420, padding: "12px 20px", borderRadius: 30, border: "1px solid #ddd", fontSize: 14, fontFamily: "inherit", marginBottom: 18 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => chooseFamily("All")} style={chip(family === "All")} aria-pressed={family === "All"}>All ({trendingColours.length})</button>
          {Object.keys(COLOUR_CATEGORIES).map(name => {
            const count = trendingColours.filter(c => COLOUR_CATEGORIES[name].colors.includes(c.name)).length;
            return (
              <button key={name} onClick={() => chooseFamily(name)} style={chip(family === name)} aria-pressed={family === name}>
                <PaintBlob size={18} color={CAT_SWATCH_COLORS[name] || "#ddd"} v={name.length} />
                {name} ({count})
              </button>
            );
          })}
        </div>
      </section>

      <section ref={gridTop} style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 20px", scrollMarginTop: 90 }}>
        <p aria-live="polite" style={{ fontSize: 14, color: "#777", marginBottom: 18 }}>
          {view.total ? "Showing " + view.from + "-" + view.to + " of " + view.total + " colours" : "No colours found"}
        </p>

        {view.total === 0 && (
          <div style={{ padding: "40px 0" }}>
            <p style={{ fontSize: 15, color: "#555", marginBottom: 14 }}>No colour matches your search.</p>
            <button className="btn bp" onClick={() => { setQuery(""); chooseFamily("All"); }}>Show all colours</button>
          </div>
        )}

        <div className="colour-grid">
          {view.items.map((c, i) => (
            <a key={c.name} href={colourHref(c)} onClick={e => { e.preventDefault(); handleColourClick(c); }}
              style={{ textDecoration: "none", color: "inherit", display: "block", background: "#fff", borderRadius: 14, border: "1px solid #eee", overflow: "hidden", cursor: "pointer", transition: "transform .3s, box-shadow .3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={{ background: c.color + "28", padding: "20px 16px", height: 160, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ width: "78%", height: "90%" }}><PaintBlob color={c.color} v={i} /></div>
              </div>
              <div style={{ padding: "14px 16px 18px" }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: "#1a1a1a" }}>{c.name}&reg;</h4>
                <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 12, minHeight: 34 }}>{c.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <code style={{ fontSize: 11, color: "#bbb", fontFamily: "monospace", letterSpacing: .5 }}>{c.color}</code>
                  <button onClick={e => { e.stopPropagation(); e.preventDefault(); addSamplePot(c.name); }} style={{ fontSize: 11, fontWeight: 600, color: B.coral, background: B.coral + "12", border: "none", padding: "4px 10px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit" }}>Sample</button>
                </div>
              </div>
            </a>
          ))}
        </div>

        {view.pages > 1 && (
          <nav aria-label="Colour pages" style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", flexWrap: "wrap", margin: "36px 0 30px" }}>
            <button onClick={() => goTo(view.page - 1)} disabled={view.page === 1} style={pbtn(false, view.page === 1)} aria-label="Previous page">&#8592; Prev</button>
            {pageList(view.page, view.pages).map((n, k) => n === "..."
              ? <span key={"gap" + k} style={{ padding: "0 4px", color: "#999" }}>&hellip;</span>
              : <button key={n} onClick={() => goTo(n)} style={pbtn(n === view.page, false)} aria-label={"Page " + n} aria-current={n === view.page ? "page" : undefined}>{n}</button>)}
            <button onClick={() => goTo(view.page + 1)} disabled={view.page === view.pages} style={pbtn(false, view.page === view.pages)} aria-label="Next page">Next &#8594;</button>
          </nav>
        )}
      </section>

      <section style={{ background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)", padding: "52px 0", color: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 12 }}>Try before you commit</h2>
          <p style={{ fontSize: 15, opacity: .75, marginBottom: 24, lineHeight: 1.6 }}>Order colour samples to see your shade at home. Screens change how colours look.</p>
          <button className="btn bp" onClick={() => nav("contact")}>Ask about colour matching</button>
        </div>
      </section>
    </div>
  );
}
