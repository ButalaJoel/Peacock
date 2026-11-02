import { useApp } from "../context/useApp.js";
import { B } from "../data/theme.js";
import PageHero from "../components/common/PageHero.jsx";

const SYSTEMS = [
  { name: "Peacock Paints Colour Guide", text: "A curated palette developed with local preferences and modern trends in mind. It helps customers confidently select shades that suit both style requirements and long-term durability in real-world environments." },
  { name: "NCS - Natural Colour System", text: "For customers who require high precision and consistency, we offer colour matching using NCS. With over 2,000 clearly defined shades, NCS supports reliable specification for professional projects, ensuring harmony, accuracy and consistent results." },
  { name: "BS 4800 - British Standard Colour System", text: "Using the BS 4800 colour system, Peacock Paints provides a trusted selection of professional shades commonly specified for architectural and commercial applications. This system supports timeless colour choices, reliable colour matching and dependable performance on a wide range of substrates." },
  { name: "NOVA Colour System", text: "With the NOVA Colour System, Peacock Paints offers precise custom colours, from subtle interiors to bold statements, ensuring consistency and superior coverage." },
  { name: "RAL", text: "RAL is listed as a colour system on our products. Ask our team about matching a RAL colour for your project." },
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
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75 }}>{s.text}</p>
          </div>
        ))}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "28px 0 60px" }}>
          <a className="btn bp" href={makeHref("all-colours")} onClick={e => go(e, "all-colours")} style={{ textDecoration: "none" }}>Shop all colours</a>
          <a className="btn bd" href={makeHref("contact")} onClick={e => go(e, "contact")} style={{ textDecoration: "none" }}>Ask about colour matching</a>
        </div>
      </section>
    </div>
  );
}
