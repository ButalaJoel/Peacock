// Complementary colours: the shades that sit opposite on the colour wheel (180 degrees away in CIE Lab hue).
// Every answer is a real shade from the Peacock chart (trendingColours), never an invented colour.
const toLab = hex => {
  const lin = c => { c /= 255; return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92; };
  const r = lin(parseInt(hex.slice(1, 3), 16)), g = lin(parseInt(hex.slice(3, 5), 16)), b = lin(parseInt(hex.slice(5, 7), 16));
  const f = t => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047), y = f(0.2126 * r + 0.7152 * g + 0.0722 * b), z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
  const L = 116 * y - 16, a = 500 * (x - y), bb = 200 * (y - z);
  return { L, a, b: bb, C: Math.hypot(a, bb), H: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 };
};
const hueGap = (p, q) => { const d = Math.abs(p - q) % 360; return Math.min(d, 360 - d); };

// Returns up to `count` Peacock shades, best match first.
export function complementsFor(colour, all, count = 3) {
  if (!colour || !colour.color) return [];
  const me = toLab(colour.color);
  const targetH = (me.H + 180) % 360;
  // Keep the same lightness, and give very pale/grey shades enough colour for the opposite to be noticeable.
  const targetC = Math.max(me.C, 28);
  const ta = targetC * Math.cos((targetH * Math.PI) / 180), tb = targetC * Math.sin((targetH * Math.PI) / 180);
  return all
    .filter(c => c.name !== colour.name && c.color)
    .map(c => ({ c, lab: toLab(c.color) }))
    .filter(x => x.lab.C >= 12 && hueGap(x.lab.H, targetH) <= 30)
    .map(x => ({ c: x.c, d: Math.hypot(x.lab.L - me.L, x.lab.a - ta, x.lab.b - tb) }))
    .sort((p, q) => p.d - q.d)
    .slice(0, count)
    .map(x => x.c);
}
