import { B } from "../../data/theme.js";

// "What's in the kit": the base tin and the hardener tin shown together.
export default function KitStrip({ items }) {
  return (
    <div style={{ marginTop: 14, background: "#faf8f5", border: "1px solid #eee", borderRadius: 14, padding: "14px 16px 16px" }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#333", marginBottom: 10 }}>What is in the kit</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {items.map((it, i) => (
          <div key={it.label} style={{ display: "contents" }}>
            {i > 0 && <span aria-hidden="true" style={{ fontSize: 22, fontWeight: 300, color: B.coral }}>+</span>}
            <figure style={{ margin: 0, flex: "1 1 0", maxWidth: 190, textAlign: "center" }}>
              <div style={{ background: "#fff", borderRadius: 10, height: 130, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #eee" }}>
                <img src={it.src} alt={it.label} loading="lazy" style={{ maxHeight: 118, maxWidth: "90%", objectFit: "contain" }} />
              </div>
              <figcaption style={{ fontSize: 12.5, fontWeight: 600, color: "#555", marginTop: 6 }}>{it.label}</figcaption>
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}
