import { useRef } from "react";
import { useApp } from "../../context/useApp.js";
import { B } from "../../data/theme.js";
import { UPDATES } from "../../data/updates.js";
import { formatMonth } from "../../utils/format.js";

// Sliding row of the latest updates. Clicking a card opens the News & Updates page.
export default function UpdatesSlider({ limit = 6 }) {
  const { nav, makeHref } = useApp();
  const rail = useRef(null);
  const items = UPDATES.slice().sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit);
  const scroll = dir => { if (rail.current) rail.current.scrollBy({ left: dir * 320, behavior: "smooth" }); };
  const arrow = { width: 40, height: 40, borderRadius: "50%", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 18, fontFamily: "inherit" };
  const badge = { fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" };
  return (
    <div>
      <div ref={rail} style={{ display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", paddingBottom: 6 }}>
        {items.map(u => (
          <a key={u.id} href={makeHref("news")} onClick={e => { e.preventDefault(); nav("news"); }}
            style={{ flex: "0 0 290px", scrollSnapAlign: "start", textDecoration: "none", color: "inherit", background: "#fff", border: "1px solid #eee", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {u.image ? (
              <div style={{ position: "relative", height: 160, background: "#f0ece6" }}>
                <img src={u.image} alt={u.imageAlt || u.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <span style={{ ...badge, position: "absolute", left: 12, bottom: 12, background: u.tone, color: "#fff", padding: "4px 10px", borderRadius: 20 }}>{u.cat}</span>
              </div>
            ) : (
              <div style={{ background: u.tone, color: "#fff", padding: "18px 20px", minHeight: 74, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <span style={{ ...badge, opacity: .85 }}>{u.cat}</span>
              </div>
            )}
            <div style={{ padding: "16px 20px 20px" }}>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>{formatMonth(u.date)}</div>
              <h3 style={{ fontSize: 17, lineHeight: 1.3, marginBottom: 8 }}>{u.title}</h3>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{u.summary}</p>
              {u.pdf && <span style={{ display: "inline-block", marginTop: 10, fontSize: 12, fontWeight: 600, color: B.coral }}>PDF available</span>}
            </div>
          </a>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center" }}>
        <button onClick={() => scroll(-1)} aria-label="Previous updates" style={arrow}>&#8592;</button>
        <button onClick={() => scroll(1)} aria-label="Next updates" style={arrow}>&#8594;</button>
        <a href={makeHref("news")} onClick={e => { e.preventDefault(); nav("news"); }} style={{ marginLeft: 8, color: B.coral, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>See all news and updates</a>
      </div>
    </div>
  );
}
