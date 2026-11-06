import { B } from "../../data/theme.js";
import { trendingColours } from "../../data/colours.js";
import { complementsFor } from "../../utils/complement.js";
import { useApp } from "../../context/useApp.js";
import PaintBlob from "../common/PaintBlob.jsx";

// "Complementary colours" band for a colour page: the shades opposite on the colour wheel, all from the Peacock chart.
export default function ComplementBand({ colour }) {
  const { handleColourClick } = useApp();
  const matches = complementsFor(colour, trendingColours, 3);
  if (!matches.length) return null;
  return (
    <section aria-label="Complementary colours" style={{ background: "#faf8f5", borderTop: "1px solid #eee", padding: "44px 24px 52px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: B.coral, fontWeight: 600, marginBottom: 6 }}>Colour match</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Complementary colours</h2>
        <p style={{ fontSize: 14, color: "#666", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.6 }}>
          These Peacock shades sit opposite {colour.name} on the colour wheel, so they bring out the best in each other.
        </p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", width: 110 }}>
            <div style={{ width: 96, height: 96, margin: "0 auto 8px" }}><PaintBlob color={colour.color} v={0} /></div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{colour.name}</div>
          </div>
          <span aria-hidden="true" style={{ fontSize: 28, fontWeight: 300, color: B.coral }}>+</span>
          {matches.map((m, i) => (
            <button key={m.name} onClick={() => { handleColourClick(m); window.scrollTo(0, 0); }} aria-label={"View " + m.name}
              style={{ background: "none", border: "none", cursor: "pointer", textAlign: "center", width: 110, padding: 0, fontFamily: "inherit" }}>
              <div style={{ width: 96, height: 96, margin: "0 auto 8px" }}><PaintBlob color={m.color} v={i + 1} /></div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>{m.name}</div>
              <div style={{ fontSize: 11.5, color: "#888" }}>{i === 0 ? "Closest match" : "Also works"}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
