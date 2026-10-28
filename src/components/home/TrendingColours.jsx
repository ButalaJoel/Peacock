import { B } from "../../data/theme.js";
import { trendingColours } from "../../data/colours.js";
import { Arr, ArrL } from "../icons/Icons.jsx";
import PaintBlob from "../common/PaintBlob.jsx";
import { useApp } from "../../context/useApp.js";

export default function TrendingColours() {
  const { colourCarouselIdx, setColourCarouselIdx, CARDS_VISIBLE, handleColourClick, nav, colourHref, aReset, addSamplePot } = useApp();
  return (
    <>
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
    </>
  );
}
