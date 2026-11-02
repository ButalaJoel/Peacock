import { useRef, useState } from "react";
import { useApp } from "../context/useApp.js";
import { B } from "../data/theme.js";
import { trendingColours } from "../data/colours.js";
import { hexToRgb, rgbToHex, nearestColours, closeness, textOn } from "../utils/colour.js";
import PageHero from "../components/common/PageHero.jsx";

const MAX_W = 760;
const LOUPE = 120;
const ZOOM = 8;

export default function ColourPickerPage() {
  const { handleColourClick, addSamplePot } = useApp();
  const canvasRef = useRef(null);
  const loupeRef = useRef(null);
  const boxRef = useRef(null);
  const pressed = useRef(false);
  const [hasImage, setHasImage] = useState(false);
  const [error, setError] = useState("");
  const [picked, setPicked] = useState(null);
  const [hover, setHover] = useState(null);
  const [saved, setSaved] = useState([]);
  const [dragging, setDragging] = useState(false);

  const loadFile = file => {
    if (!file) return;
    if (!/^image\//.test(file.type)) { setError("Please choose a photo (JPG, PNG or WebP)."); return; }
    setError("");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const scale = Math.min(1, MAX_W / img.width);
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext("2d", { willReadFrequently: true }).drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      setHasImage(true); setPicked(null); setHover(null);
    };
    img.onerror = () => { setError("That file could not be read as an image."); URL.revokeObjectURL(url); };
    img.src = url;
  };

  // read the colour under the pointer (average of a small block, so one noisy pixel does not mislead)
  const sample = e => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(1, Math.min(canvas.width - 2, Math.round((e.clientX - rect.left) * canvas.width / rect.width)));
    const y = Math.max(1, Math.min(canvas.height - 2, Math.round((e.clientY - rect.top) * canvas.height / rect.height)));
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const d = ctx.getImageData(x - 1, y - 1, 3, 3).data;
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
    const rgb = { r: Math.round(r / 9), g: Math.round(g / 9), b: Math.round(b / 9) };

    const loupe = loupeRef.current;
    if (loupe) {
      const lc = loupe.getContext("2d");
      lc.imageSmoothingEnabled = false;
      const span = LOUPE / ZOOM;
      lc.clearRect(0, 0, LOUPE, LOUPE);
      lc.drawImage(canvas, x - span / 2, y - span / 2, span, span, 0, 0, LOUPE, LOUPE);
      lc.strokeStyle = "rgba(255,255,255,.95)"; lc.lineWidth = 2;
      lc.strokeRect(LOUPE / 2 - ZOOM, LOUPE / 2 - ZOOM, ZOOM * 2, ZOOM * 2);
      lc.strokeStyle = "rgba(0,0,0,.6)"; lc.lineWidth = 1;
      lc.strokeRect(LOUPE / 2 - ZOOM - 1, LOUPE / 2 - ZOOM - 1, ZOOM * 2 + 2, ZOOM * 2 + 2);
    }
    const box = boxRef.current.getBoundingClientRect();
    return { rgb, left: e.clientX - box.left, top: e.clientY - box.top };
  };

  const onMove = e => {
    const s = sample(e);
    setHover(s);
    if (pressed.current) setPicked(s.rgb);
  };
  const onDown = e => {
    pressed.current = true;
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
    const s = sample(e);
    setHover(s); setPicked(s.rgb);
  };
  const onUp = () => { pressed.current = false; };

  const matches = picked ? nearestColours(picked, trendingColours, 3) : [];
  const hex = picked ? rgbToHex(picked) : null;
  const save = () => { if (hex && !saved.includes(hex)) setSaved(list => list.concat([hex]).slice(-6)); };

  const card = { background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 24 };
  const loupeLeft = hover ? Math.min(Math.max(hover.left + 18, 0), (boxRef.current ? boxRef.current.clientWidth : 700) - LOUPE) : 0;
  const loupeTop = hover ? Math.max(hover.top - LOUPE - 18, 0) : 0;

  return (
    <div>
      <PageHero kicker="Colours" title="Find your colour from a photo" subtitle="Upload a photo, touch or drag over it, and we find the closest Peacock colours." gradient="linear-gradient(135deg, #1a3a5c, #5c2d6d 60%, #c87856)" />
      <section className="g2" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 70px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 28, alignItems: "start" }}>
        <div style={card}>
          <div ref={boxRef} style={{ position: "relative", display: hasImage ? "block" : "none", marginBottom: 14 }}>
            <canvas ref={canvasRef}
              onPointerMove={onMove} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={onUp}
              onPointerLeave={() => { pressed.current = false; setHover(null); }}
              style={{ width: "100%", height: "auto", display: "block", borderRadius: 10, cursor: "crosshair", touchAction: "none" }} />
            <canvas ref={loupeRef} width={LOUPE} height={LOUPE}
              style={{ position: "absolute", left: loupeLeft, top: loupeTop, width: LOUPE, height: LOUPE, borderRadius: "50%", border: "3px solid #fff", boxShadow: "0 4px 18px rgba(0,0,0,.35)", pointerEvents: "none", display: hover ? "block" : "none" }} />
            {hover && <div style={{ position: "absolute", left: loupeLeft, top: loupeTop + LOUPE + 4, background: "rgba(0,0,0,.75)", color: "#fff", fontSize: 12, padding: "3px 8px", borderRadius: 10, pointerEvents: "none" }}>{rgbToHex(hover.rgb)}</div>}
          </div>

          {!hasImage && (
            <label onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]); }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 280, border: "2px dashed " + (dragging ? B.coral : "#d5d0c8"), borderRadius: 12, background: dragging ? "#fff6f2" : "#faf8f5", cursor: "pointer", textAlign: "center", padding: 24 }}>
              <span style={{ fontSize: 40, color: B.coral }}>+</span>
              <strong style={{ fontSize: 16 }}>Choose a photo</strong>
              <span style={{ fontSize: 13, color: "#888" }}>or drop it here. JPG, PNG or WebP.</span>
              <input type="file" accept="image/*" onChange={e => loadFile(e.target.files[0])} style={{ display: "none" }} />
            </label>
          )}
          {hasImage && (
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <label className="btn bd" style={{ cursor: "pointer", fontSize: 12, padding: "9px 18px" }}>
                Use another photo
                <input type="file" accept="image/*" onChange={e => loadFile(e.target.files[0])} style={{ display: "none" }} />
              </label>
              <span style={{ fontSize: 13, color: "#888" }}>Touch or drag over the photo to pick a colour.</span>
            </div>
          )}
          {error && <p style={{ color: "#c0392b", fontSize: 13, marginTop: 12 }}>{error}</p>}
          <p style={{ fontSize: 12, color: "#999", marginTop: 14, lineHeight: 1.6 }}>Your photo stays on your device. It is not uploaded anywhere.</p>
        </div>

        <div style={card}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#777", marginBottom: 12 }}>Your colour</p>
          {!picked ? (
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 16 }}>Pick a colour from your photo, or choose one yourself below.</p>
          ) : (
            <div>
              <div style={{ background: hex, color: textOn(picked), borderRadius: 12, height: 110, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "12px 16px", marginBottom: 12, border: "1px solid rgba(0,0,0,.08)" }}>
                <strong style={{ fontSize: 20 }}>{hex}</strong>
                <span style={{ fontSize: 12, opacity: .85 }}>rgb {picked.r}, {picked.g}, {picked.b}</span>
              </div>
              <button onClick={save} style={{ background: "none", border: "none", color: B.coral, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 13, padding: 0, marginBottom: 16 }}>Save this colour</button>
            </div>
          )}

          <label style={{ fontSize: 13, color: "#555", display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            Or choose a colour yourself
            <input type="color" value={hex || "#e0dbd0"} onChange={e => setPicked(hexToRgb(e.target.value))} style={{ width: 44, height: 34, border: "none", background: "none", cursor: "pointer" }} />
          </label>

          {saved.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Saved colours</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {saved.map(h => <button key={h} onClick={() => setPicked(hexToRgb(h))} aria-label={"Use " + h} style={{ width: 32, height: 32, borderRadius: "50%", background: h, border: "2px solid " + (h === hex ? B.coral : "#fff"), boxShadow: "0 0 0 1px rgba(0,0,0,.15)", cursor: "pointer" }} />)}
              </div>
            </div>
          )}

          {matches.length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#777", marginBottom: 10 }}>Closest Peacock colours</p>
              {matches.map(m => (
                <div key={m.colour.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid #f0f0f0" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: m.colour.color, border: "2px solid rgba(0,0,0,.08)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.colour.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{closeness(m.dE)}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                    <button onClick={() => handleColourClick(m.colour)} style={{ background: "none", border: "none", color: B.coral, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 13, padding: 0 }}>View</button>
                    <button onClick={() => addSamplePot(m.colour.name)} style={{ background: "none", border: "none", color: "#555", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 12, padding: 0 }}>Order sample</button>
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 12, color: "#999", marginTop: 12, lineHeight: 1.6 }}>Screens, cameras and lighting change how a colour looks. Order a sample to see the real colour in your own light.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
