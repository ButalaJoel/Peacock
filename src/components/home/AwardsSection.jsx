import { useState } from "react";
import { useAwards } from "../../lib/useAwards.js";
import Lightbox from "../common/Lightbox.jsx";

// Awards and certificates on the home page. Click a photo to enlarge it; the arrows move between them.
export default function AwardsSection() {
  const items = useAwards();
  const [open, setOpen] = useState(null);
  if (!items.length) return null;
  const images = items.map(a => ({ src: a.image_url, alt: a.title }));
  return (
    <section aria-labelledby="awards-title" style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
      <h2 id="awards-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 8 }}>Awards and certificates</h2>
      <p style={{ fontSize: 15, color: "#666", marginBottom: 28, maxWidth: 640, lineHeight: 1.7 }}>Recognition and standards that back the quality of Peacock Paints. Click a photo to see it larger.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 22 }}>
        {items.map((a, i) => (
          <figure key={a.id} style={{ margin: 0 }}>
            <button type="button" onClick={() => setOpen(i)} aria-label={"Enlarge: " + a.title}
              style={{ display: "block", width: "100%", padding: 0, border: "1px solid #eee", borderRadius: 14, overflow: "hidden", background: "#f6f4f1", cursor: "zoom-in" }}>
              <img src={a.image_url} alt={a.title} loading="lazy" style={{ display: "block", width: "100%", height: 220, objectFit: "contain" }} />
            </button>
            <figcaption style={{ marginTop: 10 }}>
              <strong style={{ fontSize: 15 }}>{a.title}</strong>
              {a.year && <span style={{ fontSize: 13, color: "#888" }}> · {a.year}</span>}
              {a.description && <div style={{ fontSize: 13, color: "#666", marginTop: 3, lineHeight: 1.5 }}>{a.description}</div>}
            </figcaption>
          </figure>
        ))}
      </div>
      <Lightbox images={images} index={open} onChange={setOpen} />
    </section>
  );
}
