import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../context/useApp.js";
import { trendingColours } from "../data/colours.js";
import { B } from "../data/theme.js";
import PageHero from "../components/common/PageHero.jsx";
import PaintBlob from "../components/common/PaintBlob.jsx";
import { askForSample } from "../utils/sampleDialog.js";
import { floodMask, mergeMask, paintMask, recolour, hexToRgb } from "../utils/visualiser.js";

const MAX_SIDE = 900;
const DISCLAIMER = "Colours as they appear on a screen are not how they look in real paint on a surface. Screens, cameras and lighting all change colour. Order a sample to see the real shade.";

const box = { background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "18px 20px" };
const pill = on => ({ padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, border: on ? "2px solid " + B.coral : "1px solid #ddd", background: on ? "#fff7f4" : "#fff" });

export default function VisualiserPage() {
  const { nav, makeHref, setQuoteOpen } = useApp();
  const [agreed, setAgreed] = useState(false);
  const [dims, setDims] = useState(null);
  const [error, setError] = useState("");
  const [tool, setTool] = useState("wall");
  const [tol, setTol] = useState(18);
  const [brush, setBrush] = useState(18);
  const [colour, setColour] = useState(null);
  const [search, setSearch] = useState("");
  const [shown, setShown] = useState(48);
  const [showOriginal, setShowOriginal] = useState(false);
  const [tick, setTick] = useState(0);
  const [busy, setBusy] = useState(false);

  const canvasRef = useRef(null);
  const baseRef = useRef(null);
  const maskRef = useRef(null);
  const undoRef = useRef([]);
  const dragRef = useRef(false);

  const draw = useCallback(() => {
    const cv = canvasRef.current, base = baseRef.current, mask = maskRef.current;
    if (!cv || !base) return;
    const ctx = cv.getContext("2d");
    let px = base.data;
    if (!showOriginal && colour && mask && mask.some(v => v)) px = recolour(base, mask, hexToRgb(colour.color));
    ctx.putImageData(new ImageData(new Uint8ClampedArray(px), base.width, base.height), 0, 0);
  }, [colour, showOriginal]);

  useEffect(() => { draw(); }, [draw, tick, dims]);

  const load = file => {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose a photo (JPG, PNG or WebP)."); return; }
    if (file.size > 20 * 1024 * 1024) { setError("That photo is too large. Please choose one under 20 MB."); return; }
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      const s = Math.min(1, MAX_SIDE / Math.max(im.width, im.height));
      const w = Math.max(1, Math.round(im.width * s)), h = Math.max(1, Math.round(im.height * s));
      const off = document.createElement("canvas");
      off.width = w; off.height = h;
      const c = off.getContext("2d");
      c.drawImage(im, 0, 0, w, h);
      baseRef.current = c.getImageData(0, 0, w, h);
      maskRef.current = new Uint8Array(w * h);
      undoRef.current = [];
      URL.revokeObjectURL(url);
      setDims({ w, h });
      setTick(t => t + 1);
    };
    im.onerror = () => { URL.revokeObjectURL(url); setError("We could not open that photo. Please try another one."); };
    im.src = url;
  };

  const reset = () => { baseRef.current = null; maskRef.current = null; undoRef.current = []; setDims(null); setColour(null); setError(""); };

  const point = e => {
    const r = canvasRef.current.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * dims.w, ((e.clientY - r.top) / r.height) * dims.h];
  };
  const pushUndo = () => { undoRef.current.push(maskRef.current.slice()); if (undoRef.current.length > 15) undoRef.current.shift(); };

  const onDown = e => {
    if (!dims) return;
    const [x, y] = point(e);
    pushUndo();
    if (tool === "wall") {
      setBusy(true);
      setTimeout(() => { maskRef.current = mergeMask(maskRef.current, floodMask(baseRef.current, x, y, tol)); setBusy(false); setTick(t => t + 1); }, 0);
    } else {
      dragRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      paintMask(maskRef.current, dims.w, dims.h, x, y, brush, tool === "add" ? 1 : 0);
      setTick(t => t + 1);
    }
  };
  const onMove = e => {
    if (!dragRef.current) return;
    const [x, y] = point(e);
    paintMask(maskRef.current, dims.w, dims.h, x, y, brush, tool === "add" ? 1 : 0);
    // quick preview while drawing: tint the selected area, the real colour is drawn on release
    const cv = canvasRef.current, base = baseRef.current, m = maskRef.current;
    const p = new Uint8ClampedArray(base.data);
    for (let i = 0; i < m.length; i++) if (m[i]) { p[i * 4] = p[i * 4] * 0.5 + 232 * 0.5; p[i * 4 + 1] = p[i * 4 + 1] * 0.5 + 96 * 0.5; p[i * 4 + 2] = p[i * 4 + 2] * 0.5 + 60 * 0.5; }
    cv.getContext("2d").putImageData(new ImageData(p, base.width, base.height), 0, 0);
  };
  const onUp = () => { if (dragRef.current) { dragRef.current = false; setTick(t => t + 1); } };

  const undo = () => { const last = undoRef.current.pop(); if (last) { maskRef.current = last; setTick(t => t + 1); } };
  const clearSel = () => { pushUndo(); maskRef.current = new Uint8Array(dims.w * dims.h); setTick(t => t + 1); };

  const download = () => {
    const base = canvasRef.current;
    const bar = 46;
    const out = document.createElement("canvas");
    out.width = base.width; out.height = base.height + bar;
    const c = out.getContext("2d");
    c.drawImage(base, 0, 0);
    c.fillStyle = "#1a1a1a"; c.fillRect(0, base.height, out.width, bar);
    c.fillStyle = "#fff"; c.font = "bold 13px sans-serif";
    c.fillText("Peacock Paints" + (colour ? " - " + colour.name : "") + " (preview only)", 12, base.height + 19);
    c.font = "11px sans-serif"; c.fillStyle = "#ddd";
    c.fillText("On-screen colour is a guide. Real paint looks different on the wall. Order a sample.", 12, base.height + 36);
    out.toBlob(b => { const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "peacock-colour-preview.png"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }, "image/png");
  };

  const q = search.trim().toLowerCase();
  const list = trendingColours.filter(c => !q || c.name.toLowerCase().includes(q));

  return (
    <div>
      <PageHero kicker="Colours" title="Colour visualiser" subtitle="See a Peacock colour on your own room or house before you buy." gradient="linear-gradient(135deg, #2d4a3e, #1a3a5c 50%, #5c2d6d)" />

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px 70px" }}>
        <div role="note" style={{ background: "#fff8e6", border: "1px solid #f0dfb0", borderRadius: 12, padding: "12px 16px", fontSize: 13.5, color: "#5b4a14", lineHeight: 1.6, marginBottom: 22 }}>
          <strong>Please note: </strong>{DISCLAIMER}
        </div>

        {!dims && (
          <div style={{ ...box, maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Before you start</h2>
            <p style={{ fontSize: 14.5, color: "#555", lineHeight: 1.7, marginBottom: 10 }}>Choose a photo of your room, wall or house. Your photo stays on your own phone or computer. It is <strong>not uploaded, not stored and not sent to Peacock Paints</strong>, and it disappears when you close or refresh this page.</p>
            <p style={{ fontSize: 13.5, color: "#777", lineHeight: 1.7, marginBottom: 16 }}>Please do not use photos that show people's faces or private documents. See our <a href={makeHref("privacy")} onClick={e => { e.preventDefault(); nav("privacy"); }} style={{ color: B.coral }}>privacy notice</a>.</p>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, marginBottom: 18, cursor: "pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3 }} />
              <span>I understand that the colours I see here are a guide only and will look different in real paint.</span>
            </label>
            <label className="btn bp" style={{ display: "inline-block", cursor: agreed ? "pointer" : "not-allowed", opacity: agreed ? 1 : 0.5 }}>
              Choose a photo
              <input type="file" accept="image/*" disabled={!agreed} onChange={e => { load(e.target.files && e.target.files[0]); e.target.value = ""; }} style={{ display: "none" }} />
            </label>
            {error && <p role="alert" style={{ color: "#b3261e", fontSize: 13.5, marginTop: 12 }}>{error}</p>}
          </div>
        )}

        {dims && (
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 520px", minWidth: 0 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
                <button style={pill(tool === "wall")} onClick={() => setTool("wall")}>Click a wall</button>
                <button style={pill(tool === "add")} onClick={() => setTool("add")}>Brush on</button>
                <button style={pill(tool === "erase")} onClick={() => setTool("erase")}>Brush off</button>
                <button style={pill(false)} onClick={undo}>Undo</button>
                <button style={pill(false)} onClick={clearSel}>Clear</button>
                <button style={pill(false)} onClick={reset}>New photo</button>
              </div>
              <div style={{ position: "relative", background: "#f3f1ee", borderRadius: 12, overflow: "hidden", lineHeight: 0 }}>
                <canvas ref={canvasRef} width={dims.w} height={dims.h} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} style={{ width: "100%", height: "auto", display: "block", touchAction: "none", cursor: tool === "wall" ? "crosshair" : "cell" }} aria-label="Your photo. Click a wall to colour it." />
                {busy && <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.7)", color: "#fff", fontSize: 12, padding: "5px 10px", borderRadius: 8, lineHeight: 1.3 }}>Working...</div>}
              </div>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap", marginTop: 14, alignItems: "center", fontSize: 13 }}>
                {tool === "wall" ? (
                  <label>Match: <input type="range" min="6" max="40" value={tol} onChange={e => setTol(+e.target.value)} style={{ verticalAlign: "middle" }} /> <span style={{ color: "#888" }}>{tol < 14 ? "tight" : tol < 26 ? "medium" : "wide"}</span></label>
                ) : (
                  <label>Brush size: <input type="range" min="4" max="60" value={brush} onChange={e => setBrush(+e.target.value)} style={{ verticalAlign: "middle" }} /></label>
                )}
                <button onPointerDown={() => setShowOriginal(true)} onPointerUp={() => setShowOriginal(false)} onPointerLeave={() => setShowOriginal(false)} style={pill(showOriginal)}>Hold to see original</button>
              </div>
              <p style={{ fontSize: 12.5, color: "#888", marginTop: 10, lineHeight: 1.6 }}>Click a wall to select it. Click more walls to add them. If the colour spills over or misses a part, change <em>Match</em>, or use the brush to add or remove areas.</p>
            </div>

            <aside style={{ flex: "0 0 340px", maxWidth: "100%", width: "100%", boxSizing: "border-box" }}>
              <div style={box}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, marginBottom: 10 }}>{colour ? colour.name : "Choose a colour"}</h3>
                <input value={search} onChange={e => { setSearch(e.target.value); setShown(48); }} placeholder="Search Peacock colours" aria-label="Search colours" style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontFamily: "inherit", fontSize: 14, marginBottom: 12 }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, maxHeight: 320, overflowY: "auto" }}>
                  {list.slice(0, shown).map(c => (
                    <button key={c.name} onClick={() => setColour(c)} title={c.name} aria-label={c.name} aria-pressed={colour && colour.name === c.name} style={{ background: colour && colour.name === c.name ? "#fff7f4" : "none", border: colour && colour.name === c.name ? "2px solid " + B.coral : "1px solid transparent", borderRadius: 10, cursor: "pointer", padding: 4 }}>
                      <PaintBlob size={48} color={c.color} v={c.name.length} />
                    </button>
                  ))}
                </div>
                {list.length > shown && <button onClick={() => setShown(s => s + 48)} style={{ ...pill(false), marginTop: 10 }}>Show more</button>}
                {!list.length && <p style={{ fontSize: 13, color: "#888" }}>No colour with that name.</p>}
                {!colour && <p style={{ fontSize: 12.5, color: "#888", marginTop: 10 }}>Pick a colour, then click a wall on your photo.</p>}
              </div>

              {colour && (
                <div style={{ ...box, marginTop: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button className="btn bp" onClick={() => askForSample(colour.name)}>Order a sample of {colour.name}</button>
                    <button className="btn bd" onClick={() => setQuoteOpen(true)}>Request a quote</button>
                    <button onClick={download} style={{ ...pill(false), padding: "11px 14px" }}>Save this picture</button>
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
