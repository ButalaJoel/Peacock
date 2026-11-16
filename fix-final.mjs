// fix-final.mjs  (DO NOT RUN YET - written for after launch sign-off)
// Run from the project root:   node fix-final.mjs
//
// 1. Logo: taken out of the nav pill, bigger, on its own (desktop). Phones keep the logo inside the bar.
// 2. Home slider: only ONE model photo (hero-1, the one painting while standing). The others are moved to originals-backup/hero/.
// 3. New page "Where do I start?" (#/start-here): for people who know nothing about Peacock Paints. Pick the surface, see the paints we recommend.
//    A button for it is added to the empty "Request a quote" box, and a link under Advice.
// 4. "Order colour samples" now opens a prompt: painted colour card, sample pot or 5 pots, for the colour they choose. Goes into the quote list.
// 5. Product page "Select Colour & Size": the colour family cards get paint blobs instead of flat rectangles.
//
// Rules: required edits must match exactly once or NOTHING is written. Soft edits (marked "soft") are skipped with a note if the
// text is not found, so one odd file cannot block the rest. No prices anywhere. Fonts are not changed.
// Undo anytime with:  git checkout . ; git clean -fd src      (hero photos are only moved, see originals-backup/hero)

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const problems = [], notes = [];
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");

// ───────────────────────────── new files ─────────────────────────────
const NEW_FILES = {};

NEW_FILES["src/utils/sampleDialog.js"] = String.raw`// Opens the colour-sample prompt from anywhere (top bar, colour pages, colour picker).
export const askForSample = colourName =>
  window.dispatchEvent(new CustomEvent("peacock:sample", { detail: { colour: colourName || "" } }));
`;

NEW_FILES["src/components/samples/SampleDialog.jsx"] = String.raw`import { useEffect, useState } from "react";
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

        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>{opt.needsColour ? "Which colour?" : "Which colours? (optional)"}</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          {known && <PaintBlob size={34} color={known.color} v={known.name.length} />}
          <input list="sample-colour-names" value={colour} onChange={e => { setColour(e.target.value); setAdded(false); }} placeholder="Start typing a Peacock colour name" style={{ flex: 1, padding: "11px 12px", border: "1px solid #ddd", borderRadius: 8, fontFamily: "inherit", fontSize: 14 }} />
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
`;

// What to paint where. The picks marked CONFIRM are suggestions for management to approve before launch.
NEW_FILES["src/data/startGuide.js"] = String.raw`// "Where do I start?" guide: which Peacock paints for which surface. Product ids come from products.catalogue.js.
// Picks without CONFIRM were given by the sales team. Picks marked CONFIRM are suggestions: management must approve them.
export const GUIDE = [
  {
    id: "interior-walls",
    title: "Inside walls",
    intro: "Living rooms, bedrooms and offices.",
    picks: ["vinyl-silk-makula", "venetian-stucco", "pearl-coat"],
  },
  {
    id: "bathrooms",
    title: "Bathrooms",
    intro: "Rooms that see steam and splashes.",
    picks: ["premium-matt"],
  },
  {
    id: "exterior-walls",
    title: "Outside walls",
    intro: "Walls that face sun and rain.",
    picks: ["mastic-textured-paint", "weathershield-plus"],
  },
  {
    id: "floors",
    title: "Floors",
    intro: "Garages, workshops, shops and factory floors.",
    picks: ["epoxy-self-levelling", "epoxy-2k-enamel"], // CONFIRM: "2K" could also mean 2K Acrylic Polyurethane
  },
  {
    id: "ceilings",
    title: "Ceilings",
    intro: "Smooth, light ceilings.",
    picks: ["super-matt-emulsion"], // CONFIRM
  },
  {
    id: "wood",
    title: "Wood and joinery",
    intro: "Doors, furniture and window frames.",
    picks: ["clear-varnish", "premium-lacquer"], // CONFIRM
  },
  {
    id: "metal",
    title: "Metal",
    intro: "Gates, grills and roofing sheets.",
    picks: ["metal-primer", "fast-dry-enamel"], // CONFIRM
  },
];
`;

NEW_FILES["src/pages/StartHerePage.jsx"] = String.raw`import { useApp } from "../context/useApp.js";
import { PRODUCTS } from "../data/products.js";
import { GUIDE } from "../data/startGuide.js";
import { B } from "../data/theme.js";
import PageHero from "../components/common/PageHero.jsx";

const STEPS = [
  ["1", "Pick the surface", "Walls, floors, wood or metal. Choose what you are painting."],
  ["2", "See what we recommend", "Each surface shows the Peacock paints made for it."],
  ["3", "Choose a colour and ask for a quote", "Add the paints to your quote list. Our sales team replies with a quotation."],
];

function ProductCard({ p }) {
  const { openProduct, addToCart } = useApp();
  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <button onClick={() => openProduct(p)} aria-label={"View " + p.name} style={{ background: "#f8f6f2", border: "none", height: 170, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
        {p.img ? <img src={p.img} alt={p.name} style={{ maxHeight: 146, maxWidth: "100%", objectFit: "contain" }} /> : <span style={{ color: "#999", fontSize: 13 }}>{p.name}</span>}
      </button>
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</h3>
        <p style={{ fontSize: 13, color: "#666", lineHeight: 1.55, flex: 1 }}>{p.desc}</p>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => openProduct(p)} style={{ background: "none", border: "none", color: B.coral, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 13, padding: 0 }}>View details</button>
          <button onClick={() => addToCart({ product: p, size: (p.packSizes && p.packSizes[0]) || (p.sizes && p.sizes[0] && p.sizes[0].size), qty: 1, colour: null })} style={{ background: "none", border: "1px solid #ddd", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 600 }}>Add to quote list</button>
        </div>
      </div>
    </div>
  );
}

export default function StartHerePage() {
  const { nav, makeHref } = useApp();
  const go = (e, page) => { e.preventDefault(); nav(page); };
  const jump = id => { const el = document.getElementById("guide-" + id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <div>
      <PageHero kicker="New to Peacock Paints?" title="Where do I start?" subtitle="Tell us what you are painting and we will show you the paints made for it." gradient="linear-gradient(135deg, #2d4a3e, #1a3a5c 50%, #5c2d6d)" />

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 24px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {STEPS.map(s => (
            <div key={s[0]} style={{ background: "#faf8f5", borderRadius: 14, padding: "18px 20px" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: B.coral, fontWeight: 700 }}>{s[0]}</span>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: "4px 0 6px" }}>{s[1]}</h3>
              <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6 }}>{s[2]}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "30px 0 4px" }} role="navigation" aria-label="Surfaces">
          {GUIDE.map(g => (
            <button key={g.id} onClick={() => jump(g.id)} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 24, padding: "9px 18px", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 500 }}>{g.title}</button>
          ))}
        </div>
      </section>

      {GUIDE.map(g => {
        const items = g.picks.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
        if (!items.length) return null;
        return (
          <section key={g.id} id={"guide-" + g.id} style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 8px", scrollMarginTop: 110 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 4 }}>{g.title}</h2>
            <p style={{ fontSize: 15, color: "#777", marginBottom: 18 }}>{g.intro}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 18 }}>
              {items.map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>
        );
      })}

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 70px" }}>
        <div style={{ background: "#1a1a1a", color: "#fff", borderRadius: 16, padding: "32px 28px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Not sure which one fits your job?</h2>
          <p style={{ fontSize: 15, opacity: 0.8, marginBottom: 20 }}>Pick your colour, or ask our team. We reply to every request.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn bp" href={makeHref("all-colours")} onClick={e => go(e, "all-colours")} style={{ textDecoration: "none" }}>Choose a colour</a>
            <a className="btn bp" href={makeHref("estimator")} onClick={e => go(e, "estimator")} style={{ textDecoration: "none" }}>How much paint do I need?</a>
            <a className="btn bp" href={makeHref("contact")} onClick={e => go(e, "contact")} style={{ textDecoration: "none" }}>Talk to our team</a>
          </div>
        </div>
      </section>
    </div>
  );
}
`;

NEW_FILES["src/data/heroPhotos.js"] = String.raw`// One model photo for the home page: the one painting while standing (hero-1). Put it in src/assets/hero/.
// Every slide uses this same photo. Until it exists, the built-in room pictures are used.
const found = import.meta.glob("../assets/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", { eager: true, import: "default" });
const keys = Object.keys(found).sort();
const keep = keys.find(k => /hero-1\./i.test(k)) || keys[0];
export const HERO_PHOTOS = keep ? [found[keep]] : [];
export const heroPhoto = (i, fallback) => HERO_PHOTOS[0] || fallback;
`;

// ───────────────────────────── edits ─────────────────────────────
// ["x", find, replace]  must match exactly once.  ["p", text] adds a line at the top.
const EDITS = {
  "src/pages/PageSwitch.jsx": [
    ["p", 'import StartHerePage from "./StartHerePage.jsx";'],
    ["x", '      ) : pg === "feedback" ? (', '      ) : pg === "start-here" ? (\n        <StartHerePage />\n      ) : pg === "feedback" ? ('],
  ],
  "src/components/layout/Header.jsx": [
    ["p", 'import SampleDialog from "../samples/SampleDialog.jsx";'],
    ["x", "</header>", "  <SampleDialog />\n    </header>"],
  ],
};

// soft edits: [file-or-"*", find, replace]
const SOFT = [
  ["src/data/navData.js", '{ label: "Customer reviews", page: "reviews" },', '{ label: "Customer reviews", page: "reviews" },\n        { label: "Where do I start?", page: "start-here" },', "Advice menu link"],
  ["src/data/navData.js", 'pg === "reviews")', 'pg === "reviews" || pg === "start-here")', "Advice menu highlight"],
];

const CSS_MARK = "/* logo-out-of-pill (fix-final.mjs) */";
const CSS_ADD = `
${CSS_MARK}
@media (min-width: 769px) {
  .pill-header { max-width: 1272px; margin: 12px auto 0; }
  .pill-bar { position: relative; max-width: none; margin: 0 0 0 200px; }
  .pill-logo { position: absolute; left: -200px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; width: 188px; }
  .pill-logo img { height: 92px; width: auto; max-width: 188px; filter: drop-shadow(0 2px 8px rgba(255,255,255,.85)); }
  .pill-nav { margin: 0 auto; }
}
@media (min-width: 769px) and (max-width: 1100px) {
  .pill-bar { margin-left: 150px; }
  .pill-logo { left: -150px; width: 140px; }
  .pill-logo img { height: 68px; max-width: 140px; }
}
`;

// ───────────────────────────── run ─────────────────────────────
const exists = f => fs.existsSync(f);
const walk = d => exists(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name).replace(/\\/g, "/")]) : [];
const srcFiles = walk("src").filter(f => /\.(jsx?|css)$/.test(f));

for (const f of ["src/pages/PageSwitch.jsx", "src/components/layout/Header.jsx", "src/components/common/PageHero.jsx", "src/components/common/PaintBlob.jsx", "src/data/heroPhotos.js", "src/styles/global.css", "src/data/products.js", "src/data/theme.js"])
  if (!exists(f)) problems.push("Missing " + f);
if (exists("src/pages/StartHerePage.jsx") && read("src/pages/StartHerePage.jsx").includes("GUIDE")) problems.push("This looks already applied (StartHerePage.jsx exists)");
if (exists("src/data/heroPhotos.js") && !read("src/data/heroPhotos.js").includes("HERO_PHOTOS")) problems.push("src/data/heroPhotos.js is not the file fix-ui-3 made");
if (exists("src/data/heroPhotos.js") && read("src/data/heroPhotos.js").includes("One model photo")) problems.push("This looks already applied (hero)");

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

// quote box: the "new to Peacock" button (found by its text, in whichever file holds it)
{
  const OLD = '<button className="btn bd" onClick={() => { setQuoteOpen(false); nav("estimator"); }}>Paint estimator</button>';
  const NEW = OLD + '\n              <button className="btn bd" onClick={() => { setQuoteOpen(false); nav("start-here"); }} style={{ flexBasis: "100%", background: "#fff", color: "#E8603C", border: "2px solid #E8603C" }}>I don\'t know anything about Peacock Paints</button>';
  const hits = srcFiles.filter(f => /\.jsx$/.test(f) && read(f).includes(OLD));
  if (hits.length !== 1) problems.push("Quote box: expected the Paint estimator button in 1 file, found " + hits.length);
  else { contents[hits[0]] = contents[hits[0]] ?? read(hits[0]); contents[hits[0]] = contents[hits[0]].replace(OLD, () => NEW); }
}

// soft: menu links
for (const [f, a, b, label] of SOFT) {
  if (!exists(f)) { notes.push("Skipped " + label + " (no " + f + ")"); continue; }
  contents[f] = contents[f] ?? read(f);
  if (contents[f].split(a).length - 1 !== 1) { notes.push("Skipped " + label + " (text not found once in " + f + ")"); continue; }
  contents[f] = contents[f].replace(a, () => b);
}

// soft: sample buttons now open the prompt
{
  const A = /onClick=\{\(\)\s*=>\s*addSamplePot\(([^()]*)\)\}/g;
  const B2 = /onClick=\{(?:\(\)\s*=>\s*addSampleBundle\(\)|addSampleBundle)\}/g;
  let total = 0;
  for (const f of srcFiles.filter(x => /\.jsx$/.test(x))) {
    let t = contents[f] ?? read(f);
    const before = t;
    t = t.replace(A, (m, arg) => { total++; return "onClick={() => askForSample(" + arg + ")}"; });
    t = t.replace(B2, () => { total++; return "onClick={() => askForSample()}"; });
    if (t === before) continue;
    for (const name of ["addSamplePot", "addSampleBundle"]) {
      const count = (t.match(new RegExp("\\b" + name + "\\b", "g")) || []).length;
      if (count === 1) t = t.replace(new RegExp(",\\s*" + name + "\\b"), "").replace(new RegExp("\\b" + name + ",\\s*"), "");
    }
    let rel = path.relative(path.dirname(f), "src/utils/sampleDialog.js").replace(/\\/g, "/");
    if (!rel.startsWith(".")) rel = "./" + rel;
    contents[f] = 'import { askForSample } from "' + rel + '";\n' + t;
  }
  if (!total) notes.push("Samples: no addSamplePot / addSampleBundle buttons found to redirect");
  for (const f of srcFiles.filter(x => /\.jsx$/.test(x))) {
    const t = contents[f] ?? read(f);
    if (/addSample(Pot|Bundle)\(/.test(t) && !/const addSample(Pot|Bundle)\s*=/.test(t)) notes.push("Samples: " + f + " still calls the old sample function directly. Send me that line.");
  }
}

// soft: colour family cards on the product page get blobs
{
  const f = "src/pages/ProductDetailPage.jsx";
  if (!exists(f)) notes.push("Blobs: no " + f);
  else {
    let t = contents[f] ?? read(f);
    const start = t.indexOf("Select Colour");
    const re = /<div style=\{\{([^{}]*?)background:\s*([A-Za-z_$][\w$]*(?:\.\w+|\[[^\]]+\])*(?:\s*\|\|\s*"[^"]*")?)([^{}]*?)\}\}\s*(?:\/>|><\/div>)/g;
    const cands = [];
    let m;
    while ((m = re.exec(t))) {
      if (m.index < start) continue;
      const style = m[1] + m[3];
      const h = style.match(/height:\s*(\d+)/);
      if (h && +h[1] >= 60 && +h[1] <= 180 && /borderRadius/.test(style)) cands.push(m);
    }
    if (cands.length !== 1) {
      notes.push("Blobs: found " + cands.length + " flat colour cards on " + f + " (needed 1). Send me the lines around \"See \" + \" shades\" in that file.");
    } else {
      const c = cands[0];
      const col = c[2];
      const rep = '<div style={{ ' + c[1].replace(/\s+$/, "") + ' background: "color-mix(in srgb, " + (' + col + ') + " 14%, #fff)", display: "grid", placeItems: "center"' + (c[3].trim() ? " " + c[3].trim().replace(/^,\s*/, ", ").replace(/^([^,])/, ", $1") : "") + ' }}><PaintBlob size={84} color={' + col + '} v={3} /></div>';
      t = t.slice(0, c.index) + rep + t.slice(c.index + c[0].length);
      if (!/import PaintBlob/.test(t)) t = 'import PaintBlob from "../components/common/PaintBlob.jsx";\n' + t;
      contents[f] = t;
    }
  }
}

if (problems.length) {
  console.log("\nNothing was changed. Problems:");
  problems.forEach(p => console.log("  - " + p));
  process.exit(1);
}

// syntax check everything we are about to write
const require = createRequire(path.resolve("package.json"));
let esbuild;
try { esbuild = require("esbuild"); } catch { problems.push("esbuild not found: run npm install first"); }
const outputs = { ...NEW_FILES, ...contents };
if (esbuild) for (const [f, c] of Object.entries(outputs)) {
  if (!/\.jsx?$/.test(f)) continue;
  try { esbuild.transformSync(c, { loader: f.endsWith(".jsx") ? "jsx" : "js" }); }
  catch (e) { problems.push("Syntax problem in " + f + ": " + String(e.message).split("\n")[0]); }
}
if (problems.length) {
  console.log("\nNothing was changed. Problems:");
  problems.forEach(p => console.log("  - " + p));
  process.exit(1);
}

for (const [f, c] of Object.entries(outputs)) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, c);
}

// logo CSS
{
  const css = "src/styles/global.css";
  const t = read(css);
  if (t.includes(CSS_MARK)) notes.push("Logo CSS was already there");
  else fs.appendFileSync(css, CSS_ADD);
}

// move the extra model photos out of the build (kept in originals-backup/hero, which git ignores)
{
  const dir = "src/assets/hero";
  const files = exists(dir) ? fs.readdirSync(dir).filter(n => /\.(jpe?g|png|webp)$/i.test(n)).sort() : [];
  const keep = files.find(n => /^hero-1\./i.test(n)) || files[0];
  const moved = [];
  fs.mkdirSync("originals-backup/hero", { recursive: true });
  for (const n of files) if (n !== keep) { fs.renameSync(path.join(dir, n), path.join("originals-backup/hero", n)); moved.push(n); }
  if (moved.length) notes.push("Moved out of the build (kept safe in originals-backup/hero): " + moved.join(", "));
  if (!keep) notes.push("No photo in src/assets/hero yet: the built-in room pictures stay until you add hero-1.jpg");
}

console.log("\nDone. Files written: " + Object.keys(outputs).length);
for (const f of Object.keys(outputs)) console.log("  " + f);
if (notes.length) { console.log("\nNotes:"); notes.forEach(n => console.log("  - " + n)); }
console.log("\nNext: npx eslint src, then npm run dev. Check: the nav bar (logo on its own), the home slider, #/start-here, the empty quote box, Order colour samples, a product page's colour cards.");
console.log("Undo anytime with:  git checkout . ; git clean -fd src");
