// Colour visualiser maths. Plain functions on { data, width, height } (same shape as canvas ImageData), so they can be tested without a browser.
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
