import { useState } from "react";
import { useApp } from "../context/useApp.js";
import { B } from "../data/theme.js";
import { UPDATE_CATEGORIES } from "../data/updates.js";
import { useUpdates } from "../lib/useUpdates.js";
import { formatMonth } from "../utils/format.js";
import PageHero from "../components/common/PageHero.jsx";
import Lightbox from "../components/common/Lightbox.jsx";
import NewsletterSignup from "../components/home/NewsletterSignup.jsx";

export default function NewsPage() {
  const { nav, makeHref } = useApp();
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(null);
  const [pdfOpen, setPdfOpen] = useState(null);
  const [box, setBox] = useState({ id: null, index: null });
  const { items: UPDATES, sample } = useUpdates();
  const items = UPDATES.filter(u => cat === "All" || u.cat === cat).sort((a, b) => (a.date < b.date ? 1 : -1));
  const boxItem = UPDATES.find(u => u.id === box.id);
  const boxImages = boxItem ? (boxItem.gallery || []).map(g => ({ src: g.src || g, alt: g.alt || boxItem.title })) : [];
  const chip = on => ({ padding: "8px 18px", borderRadius: 30, border: "1px solid " + (on ? B.coral : "#ddd"), background: on ? B.coral : "#fff", color: on ? "#fff" : "#444", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" });
  const linkBtn = { background: "none", border: "none", padding: 0, color: "#555", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 14 };
  return (
    <div>
      <PageHero kicker="Advice" title="News & Updates" subtitle="Product news, colour tips and updates from Peacock Paints." gradient="linear-gradient(135deg, #1a3a5c, #5c2d6d 60%, #c87856)" />
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 30px" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 26 }}>
          {["All"].concat(UPDATE_CATEGORIES).map(c => <button key={c} onClick={() => setCat(c)} style={chip(cat === c)}>{c}</button>)}
        </div>
        {items.map(u => {
          const isOpen = open === u.id;
          const gallery = u.gallery || [];
          return (
            <article key={u.id} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, overflow: "hidden", marginBottom: 16, display: "flex", flexWrap: "wrap" }}>
              {u.image ? (
                <div style={{ position: "relative", flex: "0 0 240px", minHeight: 160, background: "#f0ece6" }}>
                  <img src={u.image} alt={u.imageAlt || u.title} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", left: 12, bottom: 12, background: u.tone, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "4px 10px", borderRadius: 20 }}>{u.cat}</span>
                </div>
              ) : (
                <div style={{ background: u.tone, color: "#fff", flex: "0 0 150px", padding: 20, display: "flex", alignItems: "flex-end", minHeight: 90 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{u.cat}</span>
                </div>
              )}
              <div style={{ flex: "1 1 320px", padding: "20px 24px", minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>{formatMonth(u.date)}</div>
                <h2 style={{ fontSize: 20, marginBottom: 8 }}>{u.title}</h2>
                <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7 }}>{u.summary}</p>
                {isOpen && (u.body || []).map((p, i) => <p key={i} style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginTop: 10 }}>{p}</p>)}
                {isOpen && gallery.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8, marginTop: 14 }}>
                    {gallery.map((g, i) => (
                      <button key={i} onClick={() => setBox({ id: u.id, index: i })} aria-label={"Open image " + (i + 1)} style={{ padding: 0, border: "none", background: "#f0ece6", borderRadius: 8, overflow: "hidden", cursor: "zoom-in", aspectRatio: "1 / 1" }}>
                        <img src={g.src || g} alt={g.alt || u.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </button>
                    ))}
                  </div>
                )}
                {isOpen && u.pdf && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <a className="btn bp" href={u.pdf} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", fontSize: 13, padding: "9px 18px" }}>Open PDF</a>
                      <a className="btn bd" href={u.pdf} download style={{ textDecoration: "none", fontSize: 13, padding: "9px 18px" }}>Download PDF</a>
                      <button onClick={() => setPdfOpen(pdfOpen === u.id ? null : u.id)} className="btn bd" style={{ fontSize: 13, padding: "9px 18px" }}>{pdfOpen === u.id ? "Hide preview" : "Preview here"}</button>
                    </div>
                    {pdfOpen === u.id && <iframe title={u.title + " (PDF)"} src={u.pdf + "#view=FitH"} style={{ width: "100%", height: 560, border: "1px solid #eee", borderRadius: 10, marginTop: 12 }} />}
                  </div>
                )}
                <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
                  <button onClick={() => setOpen(isOpen ? null : u.id)} aria-expanded={isOpen} style={linkBtn}>{isOpen ? "Show less" : (u.pdf || gallery.length ? "See more" : "Read more")}</button>
                  {u.page && <a href={makeHref(u.page)} onClick={e => { e.preventDefault(); nav(u.page); }} style={{ color: B.coral, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>{u.cta}</a>}
                </div>
              </div>
            </article>
          );
        })}
        {sample && <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>Sample items are shown until the Peacock team publishes its own.</p>}
        <div style={{ background: "#faf8f5", border: "1px solid #eee", borderRadius: 16, padding: "30px", margin: "34px 0 60px", maxWidth: 620 }}>
          <NewsletterSignup />
        </div>
      </section>
      <Lightbox images={boxImages} index={box.index} onChange={i => setBox({ id: box.id, index: i })} />
    </div>
  );
}
