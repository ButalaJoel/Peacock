import { useApp } from "../context/useApp.js";
import PageHero from "../components/common/PageHero.jsx";

// Official sources. We link out instead of copying their colour data, which is licensed.
const SYSTEMS = [
  { name: "Peacock Paints Colour Guide", text: "A curated palette developed with local preferences and modern trends in mind. It helps customers confidently select shades that suit both style requirements and long-term durability in real-world environments.", page: "all-colours", cta: "Browse our colours" },
  { name: "NCS - Natural Colour System", text: "For customers who require high precision and consistency, we offer colour matching using NCS. With over 2,000 clearly defined shades, NCS supports reliable specification for professional projects, ensuring harmony, accuracy and consistent results.", href: "https://ncscolour.com/", cta: "Open the official NCS site" },
  { name: "BS 4800 - British Standard Colour System", text: "Using the BS 4800 colour system, Peacock Paints provides a trusted selection of professional shades commonly specified for architectural and commercial applications. This system supports timeless colour choices, reliable colour matching and dependable performance on a wide range of substrates.", href: "https://www.bsigroup.com/", cta: "Visit BSI, the standard's publisher" },
  { name: "NOVA Colour System", text: "With the NOVA Colour System, Peacock Paints offers precise custom colours, from subtle interiors to bold statements, ensuring consistency and superior coverage.", page: "contact", cta: "Ask our team about NOVA" },
  { name: "RAL", text: "RAL is listed as a colour system on our products. Ask our team about matching a RAL colour for your project.", href: "https://www.ral-farben.de/en/", cta: "Open the official RAL site" },
];

export default function ColourSystemsPage() {
  const { nav, makeHref } = useApp();
  const go = (e, page) => { e.preventDefault(); nav(page); };
  return (
    <div>
      <PageHero kicker="Colours" title="Our colour systems" subtitle="Internationally recognised colour systems, matched in our own factory in Kampala." gradient="linear-gradient(135deg, #2d4a3e, #1a3a5c 50%, #5c2d6d)" />
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "50px 24px 30px" }}>
        {SYSTEMS.map(s => (
          <div key={s.name} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "22px 26px", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 8 }}>{s.name}</h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75, marginBottom: 12 }}>{s.text}</p>
            {s.href
              ? <a href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: "#c0512f", textDecoration: "none" }}>{s.cta} &#8599;</a>
              : <a href={makeHref(s.page)} onClick={e => go(e, s.page)} style={{ fontSize: 14, fontWeight: 600, color: "#c0512f", textDecoration: "none" }}>{s.cta}</a>}
          </div>
        ))}
        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginTop: 8 }}>NCS, RAL and BS 4800 are owned by their publishers. Their official sites show the current colour charts. Colours on screen vary, so please check a physical fan deck or ask us for a sample.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "28px 0 60px" }}>
          <a className="btn bp" href={makeHref("all-colours")} onClick={e => go(e, "all-colours")} style={{ textDecoration: "none" }}>Shop all colours</a>
          <a className="btn bd" href={makeHref("colour-picker")} onClick={e => go(e, "colour-picker")} style={{ textDecoration: "none" }}>Find a colour from a photo</a>
          <a className="btn bd" href={makeHref("contact")} onClick={e => go(e, "contact")} style={{ textDecoration: "none" }}>Ask about colour matching</a>
        </div>
      </section>
    </div>
  );
}
