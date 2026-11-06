import { useId } from "react";

// A glossy blob of wet paint: a darker layer underneath, the colour on top, a lighter inner layer and shiny highlights.
// Used for every colour swatch on the site. size = pixels (small dots); leave it out to fill the parent.
const PATHS = [
  "M52 6C74 4 95 20 94 45C93 66 82 90 56 93C32 96 8 82 6 56C4 30 28 8 52 6Z",
  "M48 5C72 8 93 24 92 50C91 74 70 95 46 92C24 89 5 72 8 48C11 24 28 3 48 5Z",
  "M58 7C80 12 96 32 91 56C86 80 66 96 42 91C20 86 4 66 9 42C14 20 36 2 58 7Z",
  "M45 8C68 3 92 18 94 42C96 68 78 92 52 94C28 96 6 78 6 54C6 30 22 12 45 8Z",
];

function shade(hex, amount) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
  if (!m) return "#999999";
  const n = parseInt(m[1], 16);
  const mix = c => Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount);
  return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c => Math.max(0, Math.min(255, mix(c))).toString(16).padStart(2, "0")).join("");
}

export default function PaintBlob({ color = "#cccccc", v = 0, size, style }) {
  const id = useId().replace(/:/g, "");
  const d = PATHS[Math.abs(Math.round(Number(v) || 0)) % PATHS.length];
  const dark = shade(color, -0.3), light = shade(color, 0.28);
  const dim = size ? { width: size, height: size } : { width: "100%", height: "100%" };
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" style={{ display: "block", flexShrink: 0, overflow: "visible", ...dim, ...style }}>
      <defs>
        <radialGradient id={id + "b"} cx="34%" cy="26%" r="90%">
          <stop offset="0" stopColor={light} />
          <stop offset=".5" stopColor={color} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <radialGradient id={id + "s"} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={d} transform="translate(2.5 5)" fill={dark} opacity=".6" />
      <path d={d} fill={"url(#" + id + "b)"} stroke="rgba(0,0,0,.12)" strokeWidth=".8" />
      <path d={d} transform="translate(8 8) scale(.84)" fill="none" stroke={light} strokeOpacity=".5" strokeWidth="1.3" />
      <ellipse cx="32" cy="25" rx="16" ry="8" transform="rotate(-32 32 25)" fill={"url(#" + id + "s)"} />
      <ellipse cx="69" cy="74" rx="10" ry="3.2" transform="rotate(-35 69 74)" fill="#fff" opacity=".28" />
      <circle cx="24" cy="39" r="2.6" fill="#fff" opacity=".85" />
    </svg>
  );
}
