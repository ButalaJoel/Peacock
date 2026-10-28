import { B } from "../../data/theme.js";

export default function Newsletter() {
  return (
    <>
        {/* Newsletter */}
        <section style={{ background: `linear-gradient(135deg, ${B.coral}, ${B.coralDk})`, padding: "60px 0" }}>
          <div className="g2" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div style={{ color: "#fff" }}><h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 600, marginBottom: 12 }}>Inspiration in your inbox</h2><p style={{ fontSize: 15, opacity: .9, lineHeight: 1.6 }}>Latest colour trends + 10% off your first purchase</p></div>
            <div style={{ display: "flex", gap: 12 }}><input type="email" placeholder="Email Address" style={{ flex: 1, padding: "14px 18px", borderRadius: 6, border: "none", fontSize: 15, fontFamily: "'Outfit',sans-serif", outline: "none" }} /><button className="btn" style={{ background: B.black, color: "#fff" }}>Sign Up</button></div>
          </div>
        </section>
    </>
  );
}
