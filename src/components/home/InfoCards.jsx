import { B } from "../../data/theme.js";
import { Arr } from "../icons/Icons.jsx";

export default function InfoCards() {
  return (
    <>
        {/* Info Cards */}
        <section style={{ background: B.off, padding: "60px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <h2 className="st" style={{ marginBottom: 36 }}>We're here for you</h2>
            <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {[{ t: "Inspiration", d: "Design trends for 2026", c: "Discover", bg: `linear-gradient(135deg,${B.teal}90,${B.tealDk})` },{ t: "How To Guides", d: "Expert tips for perfect results", c: "Tips", bg: `linear-gradient(135deg,${B.coral}90,${B.coralDk})` },{ t: "Visit Us", d: "Find a Peacock stockist", c: "Find store", bg: `linear-gradient(135deg,${B.gold}90,#C89820)` }].map((c, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: "hidden", transition: "transform .3s", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                  <div style={{ background: c.bg, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 44, opacity: .4, color: "#fff" }}>{["🎨","🖌️","📍"][i]}</span></div>
                  <div style={{ padding: 20, background: "#fff" }}><h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{c.t}</h3><p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>{c.d}</p><span style={{ fontSize: 13, fontWeight: 600, color: B.coral, display: "flex", alignItems: "center", gap: 4 }}>{c.c} <Arr /></span></div>
                </div>
              ))}
            </div>
          </div>
        </section>
    </>
  );
}
