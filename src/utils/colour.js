// Colour maths for the colour picker: hex <-> rgb, rgb -> Lab, and "closest colour" matching.
export const hexToRgb = hex => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

export const rgbToHex = ({ r, g, b }) =>
  "#" + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();

const lin = c => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const f = t => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);

// sRGB (D65) -> CIE L*a*b*
export function rgbToLab({ r, g, b }) {
  const R = lin(r), G = lin(g), B = lin(b);
  const X = (R * 0.4124564 + G * 0.3575761 + B * 0.1804375) / 0.95047;
  const Y = R * 0.2126729 + G * 0.7151522 + B * 0.0721750;
  const Z = (R * 0.0193339 + G * 0.1191920 + B * 0.9503041) / 1.08883;
  return { L: 116 * f(Y) - 16, a: 500 * (f(X) - f(Y)), b: 200 * (f(Y) - f(Z)) };
}

// Distance between two colours as the eye sees it (CIE76). Under about 2 is hard to tell apart.
export const deltaE = (p, q) => Math.sqrt((p.L - q.L) ** 2 + (p.a - q.a) ** 2 + (p.b - q.b) ** 2);

// The closest colours in a palette of { name, color: "#RRGGBB", ... }.
export function nearestColours(rgb, palette, count = 3) {
  const lab = rgbToLab(rgb);
  return palette
    .map(c => { const other = hexToRgb(c.color); return other ? { colour: c, dE: deltaE(lab, rgbToLab(other)) } : null; })
    .filter(Boolean)
    .sort((x, y) => x.dE - y.dE)
    .slice(0, count);
}

export const closeness = dE => (dE < 5 ? "Very close match" : dE < 10 ? "Close match" : "Nearest Peacock colour");

// Black or white text, whichever reads better on this colour.
export const textOn = ({ r, g, b }) => (0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#1a1a1a" : "#ffffff");
