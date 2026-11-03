import { useState } from "react";
import { useApp } from "../context/useApp.js";
import { B } from "../data/theme.js";
import { PRODUCTS } from "../data/products.js";
import { PROJECT_TYPES, TYPE_TONES } from "../data/projects.js";
import { useProjects } from "../lib/useProjects.js";
import PageHero from "../components/common/PageHero.jsx";
import Lightbox from "../components/common/Lightbox.jsx";

export default function ProjectsPage() {
  const { nav, makeHref, openProduct, setQuoteOpen } = useApp();
  const [type, setType] = useState("All");
  const [open, setOpen] = useState(null);
  const [box, setBox] = useState({ id: null, index: null });
  const { items: PROJECTS, loading } = useProjects();
  const items = PROJECTS.filter(p => type === "All" || p.type === type);
  const boxItem = PROJECTS.find(p => p.id === box.id);
  const boxImages = boxItem ? (boxItem.gallery || []).map(g => ({ src: g.src || g, alt: g.alt || boxItem.name })) : [];
  const hasSample = PROJECTS.some(p => p.sample);
  const chip = on => ({ padding: "8px 18px", borderRadius: 30, border: "1px solid " + (on ? B.coral : "#ddd"), background: on ? B.coral : "#fff", color: on ? "#fff" : "#444", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" });
  const linkBtn = { background: "none", border: "none", padding: 0, color: "#555", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 14 };

  return (
    <div>
      <PageHero kicker="Professionals" title="Our projects" subtitle="Places where Peacock Paints has been used, from homes to industrial sites." gradient="linear-gradient(135deg, #2d4a3e, #1a3a5c 55%, #5c2d6d)" />
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 30px" }}>
        {hasSample && <p style={{ background: "#fff6e5", border: "1px solid #f0dcae", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#7a5a12", marginBottom: 22 }}>The projects below are sample layouts. Real projects will replace them.</p>}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 26 }}>
          {["All"].concat(PROJECT_TYPES).map(t => <button key={t} onClick={() => setType(t)} style={chip(type === t)} aria-pressed={type === t}>{t}</button>)}
        </div>

        {loading && <p style={{ fontSize: 15, color: "#666", padding: "30px 0" }}>Loading projects...</p>}
        {!loading && items.length === 0 && <p style={{ fontSize: 15, color: "#666", padding: "30px 0" }}>No projects in this group yet.</p>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 22, alignItems: "start" }}>
          {items.map(p => {
            const isOpen = open === p.id;
            const gallery = p.gallery || [];
            const used = (p.products || []).map(id => PRODUCTS.find(x => x.id === id)).filter(Boolean);
            return (
              <article key={p.id} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, overflow: "hidden" }}>
                {p.image ? (
                  <div style={{ position: "relative", height: 210, background: "#f0ece6" }}>
                    <img src={p.image} alt={p.imageAlt || p.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <span style={{ position: "absolute", left: 12, bottom: 12, background: TYPE_TONES[p.type] || "#444", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "4px 10px", borderRadius: 20 }}>{p.type}</span>
                  </div>
                ) : (
                  <div style={{ background: TYPE_TONES[p.type] || "#444", color: "#fff", height: 150, padding: 20, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{p.type}</span>
                    {p.sample && <span style={{ fontSize: 11, opacity: .8 }}>Sample</span>}
                  </div>
                )}
                <div style={{ padding: "18px 22px 22px" }}>
                  <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>{[p.location, p.year].filter(Boolean).join(" · ")}</div>
                  <h2 style={{ fontSize: 20, marginBottom: 8 }}>{p.name}</h2>
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>{p.summary}</p>

                  {isOpen && (
                    <div>
                      {(p.body || []).map((t, i) => <p key={i} style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginTop: 10 }}>{t}</p>)}
                      {p.client && <p style={{ fontSize: 13, color: "#888", marginTop: 10 }}>Client: {p.client}</p>}
                      {gallery.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8, marginTop: 14 }}>
                          {gallery.map((g, i) => (
                            <button key={i} onClick={() => setBox({ id: p.id, index: i })} aria-label={"Open image " + (i + 1)} style={{ padding: 0, border: "none", background: "#f0ece6", borderRadius: 8, overflow: "hidden", cursor: "zoom-in", aspectRatio: "1 / 1" }}>
                              <img src={g.src || g} alt={g.alt || p.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            </button>
                          ))}
                        </div>
                      )}
                      {used.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#888", marginBottom: 8 }}>Peacock products used</p>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {used.map(x => <button key={x.id} onClick={() => openProduct(x)} style={{ border: "1px solid #e2e2e2", background: "#faf8f5", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#333" }}>{x.name}</button>)}
                          </div>
                        </div>
                      )}
                      <div style={{ marginTop: 18 }}>
                        <button className="btn bp" onClick={() => setQuoteOpen(true)} style={{ fontSize: 13, padding: "10px 20px" }}>Request a quote</button>
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: 14 }}>
                    <button onClick={() => setOpen(isOpen ? null : p.id)} aria-expanded={isOpen} style={linkBtn}>{isOpen ? "Show less" : "See the project"}</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div style={{ background: "#faf8f5", border: "1px solid #eee", borderRadius: 16, padding: "30px", margin: "44px 0 60px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 10 }}>Planning a project?</h2>
          <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 20px" }}>Our team can help with colour selection, surface preparation and on-site technical guidance.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn bp" href={makeHref("contact")} onClick={e => { e.preventDefault(); nav("contact"); }} style={{ textDecoration: "none" }}>Talk to our team</a>
            <a className="btn bd" href={makeHref("professionals")} onClick={e => { e.preventDefault(); nav("professionals"); }} style={{ textDecoration: "none" }}>For professionals</a>
          </div>
        </div>
      </section>
      <Lightbox images={boxImages} index={box.index} onChange={i => setBox({ id: box.id, index: i })} />
    </div>
  );
}
