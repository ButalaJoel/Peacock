// add-visualiser.mjs  (DO NOT RUN YET. Run fix-final.mjs first, then this.)
// Run from the project root:   node add-visualiser.mjs
//
// Adds a COLOUR VISUALISER (#/visualiser): the visitor chooses a photo of their room or house, clicks a wall, picks a Peacock colour,
// and sees the colour on their own photo. Light and shadow of the photo are kept, so it still looks like a wall.
//   * Data protection: the photo is processed on the visitor's own device only. It is never uploaded, stored or sent anywhere.
//     A "before you start" notice and a tick box come first. (Sending a photo to our team would need a new consent step and storage rules.)
//   * Disclaimer: a note at the top of the visualiser, on the saved picture, under every colour page and on the product colour section:
//     colours on screen are not how real paint looks on a surface.
//   * "Order a sample" and "Request a quote" buttons sit next to the picked colour.
//
// Required edits match exactly once or NOTHING is written. Soft edits are skipped with a note. No prices, fonts untouched.
// Undo anytime with:  git checkout . ; git clean -fd src

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const problems = [], notes = [];
const exists = f => fs.existsSync(f);
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");

const NEW_FILES = {
  "src/utils/visualiser.js": String.raw`// Colour visualiser maths. Plain functions on { data, width, height } (same shape as canvas ImageData), so they can be tested without a browser.
// Nothing here sends or stores a picture: everything happens on the visitor's own device.

const srgb = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const unsrgb = v => { v = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; return Math.max(0, Math.min(255, Math.round(v * 255))); };
const f = t => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
const finv = t => (t * t * t > 0.008856 ? t * t * t : (t - 16 / 116) / 7.787);

export function rgbToLab(r, g, b) {
  const R = srgb(r), G = srgb(g), B = srgb(b);
  const x = f((R * 0.4124564 + G * 0.3575761 + B * 0.1804375) / 0.95047);
  const y = f(R * 0.2126729 + G * 0.7151522 + B * 0.072175);
  const z = f((R * 0.0193339 + G * 0.119192 + B * 0.9503041) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

export function labToRgb(L, a, b) {
  const y = (L + 16) / 116, x = y + a / 500, z = y - b / 200;
  const X = finv(x) * 0.95047, Y = finv(y), Z = finv(z) * 1.08883;
  return [
    unsrgb(X * 3.2404542 - Y * 1.5371385 - Z * 0.4985314),
    unsrgb(-X * 0.969266 + Y * 1.8760108 + Z * 0.041556),
    unsrgb(X * 0.0556434 - Y * 0.2040259 + Z * 1.0572252),
  ];
}

export function hexToRgb(hex) {
  let h = String(hex || "").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  const n = parseInt(h, 16);
  if (!/^[0-9a-f]{6}$/i.test(h)) return [200, 200, 200];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Magic-wand selection: grows from the clicked point over pixels that look like the wall.
// Lightness counts for less than colour, so a wall that is brighter near the window is still one wall.
export function floodMask(img, sx, sy, tolerance) {
  const { data, width: w, height: h } = img;
  sx = Math.max(0, Math.min(w - 1, Math.round(sx))); sy = Math.max(0, Math.min(h - 1, Math.round(sy)));
  const lab = new Float32Array(w * h * 3);
  for (let i = 0; i < w * h; i++) { const l = rgbToLab(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]); lab[i * 3] = l[0]; lab[i * 3 + 1] = l[1]; lab[i * 3 + 2] = l[2]; }
  // seed colour = average of a small patch, so one noisy pixel does not decide
  let sL = 0, sa = 0, sb = 0, n = 0;
  for (let y = Math.max(0, sy - 2); y <= Math.min(h - 1, sy + 2); y++) for (let x = Math.max(0, sx - 2); x <= Math.min(w - 1, sx + 2); x++) { const i = y * w + x; sL += lab[i * 3]; sa += lab[i * 3 + 1]; sb += lab[i * 3 + 2]; n++; }
  sL /= n; sa /= n; sb /= n;
  const t2 = tolerance * tolerance;
  const ok = i => { const dL = (lab[i * 3] - sL) * 0.45, da = lab[i * 3 + 1] - sa, db = lab[i * 3 + 2] - sb; return dL * dL + da * da + db * db <= t2; };
  const mask = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  let sp = 0;
  const start = sy * w + sx;
  mask[start] = 1; stack[sp++] = start;
  while (sp) {
    const i = stack[--sp], x = i % w, y = (i - x) / w;
    if (x > 0 && !mask[i - 1] && ok(i - 1)) { mask[i - 1] = 1; stack[sp++] = i - 1; }
    if (x < w - 1 && !mask[i + 1] && ok(i + 1)) { mask[i + 1] = 1; stack[sp++] = i + 1; }
    if (y > 0 && !mask[i - w] && ok(i - w)) { mask[i - w] = 1; stack[sp++] = i - w; }
    if (y < h - 1 && !mask[i + w] && ok(i + w)) { mask[i + w] = 1; stack[sp++] = i + w; }
  }
  return mask;
}

export function mergeMask(a, b) { const out = new Uint8Array(a.length); for (let i = 0; i < a.length; i++) out[i] = a[i] | b[i]; return out; }

// Brush: add (value 1) or erase (value 0) a round patch.
export function paintMask(mask, w, h, cx, cy, radius, value) {
  const r2 = radius * radius;
  for (let y = Math.max(0, Math.floor(cy - radius)); y <= Math.min(h - 1, Math.ceil(cy + radius)); y++)
    for (let x = Math.max(0, Math.floor(cx - radius)); x <= Math.min(w - 1, Math.ceil(cx + radius)); x++)
      if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r2) mask[y * w + x] = value;
}

// Soft edge: a small box blur of the mask, so the new colour does not end in a hard jagged line.
function feather(mask, w, h, r) {
  if (r < 1) return Float32Array.from(mask);
  const tmp = new Float32Array(w * h), out = new Float32Array(w * h), k = 2 * r + 1;
  for (let y = 0; y < h; y++) { let s = 0; for (let x = -r; x <= r; x++) s += mask[y * w + Math.max(0, Math.min(w - 1, x))]; for (let x = 0; x < w; x++) { tmp[y * w + x] = s / k; s += mask[y * w + Math.min(w - 1, x + r + 1)] - mask[y * w + Math.max(0, x - r)]; } }
  for (let x = 0; x < w; x++) { let s = 0; for (let y = -r; y <= r; y++) s += tmp[Math.max(0, Math.min(h - 1, y)) * w + x]; for (let y = 0; y < h; y++) { out[y * w + x] = s / k; s += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x]; } }
  return out;
}

// Paints the chosen colour onto the masked area but keeps the light and shadow of the photo,
// so the wall still looks like a wall: darker in the corners, brighter by the window.
export function recolour(img, mask, rgb, opts = {}) {
  const { width: w, height: h, data } = img;
  const out = new Uint8ClampedArray(data);
  const [tL, ta, tb] = rgbToLab(rgb[0], rgb[1], rgb[2]);
  let sum = 0, n = 0;
  for (let i = 0; i < w * h; i++) if (mask[i]) { sum += rgbToLab(data[i * 4], data[i * 4 + 1], data[i * 4 + 2])[0]; n++; }
  if (!n) return out;
  const mean = sum / n;
  const keep = opts.shading === undefined ? 1 : opts.shading;
  const alpha = feather(mask, w, h, opts.feather === undefined ? 2 : opts.feather);
  for (let i = 0; i < w * h; i++) {
    const a = alpha[i];
    if (a <= 0.003) continue;
    const L = rgbToLab(data[i * 4], data[i * 4 + 1], data[i * 4 + 2])[0];
    const nl = Math.max(0, Math.min(100, tL + (L - mean) * keep));
    const c = labToRgb(nl, ta, tb);
    for (let k = 0; k < 3; k++) out[i * 4 + k] = Math.round(c[k] * a + data[i * 4 + k] * (1 - a));
  }
  return out;
}
`,
  "src/pages/VisualiserPage.jsx": String.raw`import { useCallback, useEffect, useRef, useState } from "react";
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
`,
  "src/components/colours/ScreenColourNote.jsx": String.raw`import { useApp } from "../../context/useApp.js";
import { B } from "../../data/theme.js";

// Reminder shown under colours: screens do not show true paint colour. Also points to the visualiser.
export default function ScreenColourNote() {
  const { nav, makeHref } = useApp();
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 24px 40px" }}>
      <div style={{ background: "#fff8e6", border: "1px solid #f0dfb0", borderRadius: 12, padding: "14px 18px", fontSize: 13.5, color: "#5b4a14", lineHeight: 1.65 }}>
        <strong>Colours on screen are a guide only.</strong> They do not look exactly the same in real paint on a wall. Screens, cameras and lighting all change colour, so we recommend ordering a sample first.{" "}
        <a href={makeHref("visualiser")} onClick={e => { e.preventDefault(); nav("visualiser"); }} style={{ color: B.coral, fontWeight: 600 }}>Try this colour on your own photo</a>
      </div>
    </section>
  );
}
`,
};

const EDITS = {
  "src/pages/PageSwitch.jsx": [
    ["p", 'import VisualiserPage from "./VisualiserPage.jsx";'],
    ["x", '      ) : pg === "feedback" ? (', '      ) : pg === "visualiser" ? (\n        <VisualiserPage />\n      ) : pg === "feedback" ? ('],
  ],
};
const SOFT = [
  ["src/data/navData.js", '{ label: "Customer reviews", page: "reviews" },', '{ label: "Customer reviews", page: "reviews" },\n        { label: "Colour visualiser", page: "visualiser" },', "Advice menu link"],
  ["src/data/navData.js", '|| pg === "reviews"', '|| pg === "reviews" || pg === "visualiser"', "Advice menu highlight"],
  ["src/pages/ColourDetailPage.jsx", "<ComplementBand colour={colour} />", "<ComplementBand colour={colour} />\n      <ScreenColourNote />", "colour page note", 'import ScreenColourNote from "../components/colours/ScreenColourNote.jsx";'],
  ["src/pages/ProductDetailPage.jsx", "Choose from our full range of colours available for this paint.", "Choose from our full range of colours available for this paint. Colours on screen can look different from real paint, so we recommend ordering a sample first.", "product colour note"],
];

for (const f of ["src/pages/PageSwitch.jsx", "src/components/common/PageHero.jsx", "src/components/common/PaintBlob.jsx", "src/data/colours.js", "src/data/theme.js"]) if (!exists(f)) problems.push("Missing " + f);
if (!exists("src/utils/sampleDialog.js")) problems.push("Run fix-final.mjs first (it creates src/utils/sampleDialog.js)");
if (exists("src/pages/VisualiserPage.jsx")) problems.push("This looks already applied (VisualiserPage.jsx exists)");

const contents = {};
for (const f of Object.keys(EDITS)) if (exists(f)) contents[f] = read(f);
for (const [f, edits] of Object.entries(EDITS)) {
  if (contents[f] === undefined) continue;
  for (const e of edits) {
    if (e[0] === "p") { contents[f] = e[1] + "\n" + contents[f]; continue; }
    const n = contents[f].split(e[1]).length - 1;
    if (n !== 1) { problems.push(f + ": expected 1 match, found " + n + " for: " + e[1].slice(0, 90)); continue; }
    contents[f] = contents[f].replace(e[1], () => e[2]);
  }
}
for (const [f, a, b, label, imp] of SOFT) {
  if (!exists(f)) { notes.push("Skipped " + label + " (no " + f + ")"); continue; }
  contents[f] = contents[f] ?? read(f);
  if (contents[f].split(a).length - 1 !== 1) { notes.push("Skipped " + label + " (text not found exactly once in " + f + ")"); continue; }
  contents[f] = contents[f].replace(a, () => b);
  if (imp && !contents[f].includes(imp)) contents[f] = imp + "\n" + contents[f];
}

if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }

const require = createRequire(path.resolve("package.json"));
let esbuild;
try { esbuild = require("esbuild"); } catch { problems.push("esbuild not found: run npm install first"); }
const outputs = { ...NEW_FILES, ...contents };
if (esbuild) for (const [f, c] of Object.entries(outputs)) {
  try { esbuild.transformSync(c, { loader: f.endsWith(".jsx") ? "jsx" : "js" }); }
  catch (e) { problems.push("Syntax problem in " + f + ": " + String(e.message).split("\n")[0]); }
}
if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }

for (const [f, c] of Object.entries(outputs)) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, c); }
console.log("\nDone. Files written: " + Object.keys(outputs).length);
for (const f of Object.keys(outputs)) console.log("  " + f);
if (notes.length) { console.log("\nNotes:"); notes.forEach(n => console.log("  - " + n)); }
console.log("\nNext: npx eslint src, then npm run dev and open #/visualiser. Also add the visualiser line to the privacy notice (see my message).");
console.log("Undo anytime with:  git checkout . ; git clean -fd src");
