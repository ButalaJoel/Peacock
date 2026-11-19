import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "../../context/useApp.js";
import { SAMPLE_POT, SAMPLE_BUNDLE } from "../../data/products.js";
import { trendingColours } from "../../data/colours.js";
import PaintBlob from "../common/PaintBlob.jsx";
import { B } from "../../data/theme.js";

// The painted card is a product we plan to sell. It goes into the quote list like any other item (no prices).
const SAMPLE_CARD = {
  id: "colour-card",
  name: "Painted colour card",
  category: "samples",
  desc: "A real card painted with the shade, to hold against your wall.",
  img: null,
  sizes: [{ size: "1 card", coverage: "sample" }],
};

const OPTIONS = [
  { key: "card", product: SAMPLE_CARD, size: "1 card", title: "Painted colour card", text: "A real card painted with your shade. Hold it against your wall in the morning, afternoon and evening light.", needsColour: true },
  { key: "pot", product: SAMPLE_POT, size: "100ml", title: "Sample pot (100 ml)", text: "A tester pot, so you can paint a patch on your own wall and live with it for a few days.", needsColour: true },
  { key: "bundle", product: SAMPLE_BUNDLE, size: "5 pots", title: "5 sample pots", text: "Five tester pots. Type the colours you want in the box below.", needsColour: false },
];

export default function SampleDialog() {
  const { addToCart, setQuoteOpen } = useApp();
  const [open, setOpen] = useState(false);
  const [colour, setColour] = useState("");
  const [choice, setChoice] = useState("card");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const onOpen = e => { setColour((e.detail && e.detail.colour) || ""); setAdded(false); setOpen(true); };
    window.addEventListener("peacock:sample", onOpen);
    return () => window.removeEventListener("peacock:sample", onOpen);
  }, []);

  if (!open) return null;
  const opt = OPTIONS.find(o => o.key === choice);
  const known = trendingColours.find(c => c.name.toLowerCase() === colour.trim().toLowerCase());
  const canAdd = !opt.needsColour || colour.trim().length > 0;

  const add = () => {
    addToCart({ product: opt.product, size: opt.size, qty: 1, colour: colour.trim() || null });
    setAdded(true);
  };

  const modal = (
    <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div role="dialog" aria-label="Order colour samples" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, width: 560, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", padding: 28, boxShadow: "0 24px 70px rgba(0,0,0,.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{ fontSize: 24, fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>See the real colour first</h3>
          <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, lineHeight: 1 }}>×</button>
        </div>
        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 18 }}>Screens change how a colour looks. Choose a sample, tell us the shade, and it goes into your quote list.</p>

        <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
          {OPTIONS.map(o => (
            <button key={o.key} onClick={() => { setChoice(o.key); setAdded(false); }} style={{ textAlign: "left", cursor: "pointer", fontFamily: "inherit", padding: "14px 16px", borderRadius: 10, border: choice === o.key ? "2px solid " + B.coral : "1px solid #e4e0da", background: choice === o.key ? "#fff7f4" : "#fff" }}>
              <strong style={{ fontSize: 15 }}>{o.title}</strong>
              <span style={{ display: "block", fontSize: 13, color: "#666", marginTop: 3, lineHeight: 1.5 }}>{o.text}</span>
            </button>
          ))}
        </div>

        <label htmlFor="f-sampledialog-1" style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>{opt.needsColour ? "Which colour?" : "Which colours? (optional)"}</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          {known && <PaintBlob size={34} color={known.color} v={known.name.length} />}
          <input id="f-sampledialog-1" list="sample-colour-names" value={colour} onChange={e => { setColour(e.target.value); setAdded(false); }} placeholder="Start typing a Peacock colour name" style={{ flex: 1, padding: "11px 12px", border: "1px solid #ddd", borderRadius: 8, fontFamily: "inherit", fontSize: 14 }} />
          <datalist id="sample-colour-names">{trendingColours.map(c => <option key={c.name} value={c.name} />)}</datalist>
        </div>
        <p style={{ fontSize: 12, color: "#999", marginBottom: 18 }}>A colour from another system (NCS, BS 4800, NOVA, RAL)? Type its code and we will match it.</p>

        {added ? (
          <div style={{ background: "#f1f8f2", border: "1px solid #cfe5d2", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ fontSize: 14, marginBottom: 12 }}>Added to your quote list.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn bp" onClick={() => { setOpen(false); setQuoteOpen(true); }}>Review my quote list</button>
              <button className="btn bd" onClick={() => { setColour(""); setAdded(false); }}>Add another colour</button>
            </div>
          </div>
        ) : (
          <button className="btn bp" disabled={!canAdd} onClick={add} style={{ opacity: canAdd ? 1 : 0.5 }}>Add to my quote list</button>
        )}
        <p style={{ fontSize: 12, color: "#999", marginTop: 14, lineHeight: 1.6 }}>No payment is taken on the website. Our sales team confirms availability and the sample cost with your quotation.</p>
      </div>
    </div>
  );
  // drawn on the page itself so no menu or button can sit on top of it
  return createPortal(modal, document.body);
}
