// Phone fixes + faster home slider:
//  - colour pages: the two panels stack on phones (they were squeezed side by side)
//  - story pages: the dark band no longer cuts words off on phones
//  - home slider: changes every 4.5 s (was 6.5 s), fades between photos, preloads all photos, and you can swipe on a phone
// Run from the project root:  node fix-mobile.mjs      Undo: git checkout .
import fs from "node:fs";
import path from "node:path";

const CSS = `
/* mobile-fixes (fix-mobile.mjs) */
.paint-hero-room { animation: heroFade .6s ease; object-position: 50% 12%; }
@keyframes heroFade { from { opacity: 0; } to { opacity: 1; } }
@media (max-width: 820px) {
  .cd-split { flex-direction: column !important; height: auto !important; min-height: 0 !important; }
  .cd-split > div { width: 100% !important; box-sizing: border-box !important; }
  .cd-split > div:first-child { padding: 32px 22px !important; }
  .cd-split > div:last-child { min-height: 320px; }
}
`;
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const problems = [];
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const cssFile = fs.existsSync("src") ? walk("src").find(f => path.basename(f) === "global.css") : null;
if (!cssFile) problems.push("Could not find global.css");
else if (read(cssFile).includes("mobile-fixes (fix-mobile.mjs)")) problems.push("This looks already applied");

const files = { "src/pages/ColourDetailPage.jsx": null, "src/pages/StoryPage.jsx": null, "src/components/home/Hero.jsx": null };
for (const f of Object.keys(files)) { if (!fs.existsSync(f)) problems.push("Missing " + f); else files[f] = read(f); }
const once = (f, find, rep, what) => {
  if (files[f] === null) return;
  const c = files[f].split(find).length - 1;
  if (c !== 1) problems.push(f + ": expected 1 match, found " + c + " for " + what); else files[f] = files[f].replace(find, () => rep);
};
const CD = "src/pages/ColourDetailPage.jsx", SP = "src/pages/StoryPage.jsx", HE = "src/components/home/Hero.jsx";
once(CD, '<div style={{ display: "flex", height: "calc(100vh - 157px)", minHeight: 520 }}>', '<div className="cd-split" style={{ display: "flex", height: "calc(100vh - 157px)", minHeight: 520 }}>', "the two-panel container");
once(SP, "gridTemplateColumns: `repeat(${p.stats.length}, 1fr)`", 'gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))"', "the band columns");
once(SP, "fontSize: 36, fontWeight: 700, color: B.coral", 'fontSize: "clamp(24px, 6.5vw, 36px)", fontWeight: 700, color: B.coral', "the band number size");
once(HE, 'import { useState, useEffect } from "react";', 'import { useState, useEffect, useRef } from "react";', "the react import");
once(HE, "const [heroSlide, setHeroSlide] = useState(0);", "const [heroSlide, setHeroSlide] = useState(0);\n  const touchX = useRef(null);", "the slide state");
once(HE, "setInterval(() => setHeroSlide(s => (s + 1) % 3), 6500)", "setInterval(() => setHeroSlide(s => (s + 1) % 3), 4500)", "the slide timer");
once(HE, "onBlur={() => setHeroPaused(false)}", "onBlur={() => setHeroPaused(false)}\n          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}\n          onTouchEnd={e => { if (touchX.current === null) return; const dx = e.changedTouches[0].clientX - touchX.current; touchX.current = null; if (Math.abs(dx) > 40) showHeroSlide(heroSlide + (dx < 0 ? 1 : -1)); }}", "the touch handlers");
once(HE, "<img className=\"paint-hero-room\" src={currentHero.roomImg} alt={`${currentHero.note} painted with Peacock colours`} />",
  "<img key={heroSlide} className=\"paint-hero-room\" src={currentHero.roomImg} alt={`${currentHero.note} painted with Peacock colours`} />\n              <div style={{ display: \"none\" }} aria-hidden=\"true\">{heroSlides.map(sl => <img key={sl.eyebrow} src={sl.roomImg} alt=\"\" />)}</div>", "the slide picture");
if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }
for (const [f, c] of Object.entries(files)) fs.writeFileSync(f, c);
fs.appendFileSync(cssFile, CSS);
console.log("\nDone. Colour pages stack on phones, story band wraps, and the home slider is faster with fade, preload and swipe.\nNext: npx eslint src, then npm run dev and check on a phone view.\nUndo anytime with:  git checkout .");
