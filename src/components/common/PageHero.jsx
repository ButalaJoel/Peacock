// Coloured banner at the top of the information pages.
export default function PageHero({ kicker, title, subtitle, gradient }) {
  return (
    <section style={{ background: gradient, padding: "64px 0 52px", color: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        {kicker && <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, marginBottom: 14, opacity: .85, fontWeight: 600 }}>{kicker}</p>}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 700, marginBottom: 14 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 18, opacity: .92, fontWeight: 300, lineHeight: 1.6 }}>{subtitle}</p>}
      </div>
    </section>
  );
}
