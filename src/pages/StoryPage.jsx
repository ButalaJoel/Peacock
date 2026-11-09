import { B } from "../data/theme.js";
import { storyPages } from "../data/storyPages.js";
import { useApp } from "../context/useApp.js";

export default function StoryPage({ pageKey }) {
  const { nav, makeHref, aReset, iconFor } = useApp();
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
      {p.stats && p.stats.length > 0 && (
        <section style={{ background: "#1a1a1a", color: "#fff", padding: "32px 0" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 24, textAlign: "center" }}>
            {p.stats.map((s, i) => (<div key={i}><div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 6.5vw, 36px)", fontWeight: 700, color: B.coral }}>{s.n}</div><div style={{ fontSize: 13, opacity: .7, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div></div>))}
          </div>
        </section>
      )}
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

  return renderStory(pageKey);
}
