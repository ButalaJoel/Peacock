import { useApp } from "../../context/useApp.js";
import { B } from "../../data/theme.js";
import { CONTACT } from "../../config/contact.js";
import { Arr } from "../icons/Icons.jsx";

// "We're here for you": every card is a real link.
export default function InfoCards() {
  const { nav, makeHref } = useApp();
  const cards = [
    { t: "Inspiration", d: "Room ideas and colour styles", c: "Discover", page: "bedroom-inspiration", icon: "🎨", bg: "linear-gradient(135deg," + B.teal + "90," + B.tealDk + ")" },
    { t: "Our Projects", d: "Places where Peacock Paints is used", c: "See projects", page: "projects", icon: "🏠", bg: "linear-gradient(135deg, #5c2d6d90, #3d1d4a)" },
    { t: "News & Tips", d: "Product news and expert tips", c: "Read more", page: "news", icon: "🖌️", bg: "linear-gradient(135deg," + B.coral + "90," + B.coralDk + ")" },
    { t: "Visit Us", d: CONTACT.address || "Kampala, Uganda", c: "Contact us", page: "contact", icon: "📍", bg: "linear-gradient(135deg," + B.gold + "90,#C89820)" },
  ];
  return (
    <section style={{ background: B.off, padding: "60px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <h2 className="st" style={{ marginBottom: 36 }}>We're here for you</h2>
        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {cards.map(c => (
            <a key={c.page} href={makeHref(c.page)} onClick={e => { e.preventDefault(); nav(c.page); }}
              style={{ borderRadius: 12, overflow: "hidden", transition: "transform .3s, box-shadow .3s", cursor: "pointer", textDecoration: "none", color: "inherit", display: "block", background: "#fff" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 34px rgba(0,0,0,.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={{ background: c.bg, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 44, opacity: .5, color: "#fff" }}>{c.icon}</span></div>
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{c.t}</h3>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 12, lineHeight: 1.5, minHeight: 40 }}>{c.d}</p>
                <span style={{ fontSize: 13, fontWeight: 600, color: B.coral, display: "flex", alignItems: "center", gap: 4 }}>{c.c} <Arr /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
