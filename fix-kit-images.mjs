// Shows the base tin and the hardener tin together on the product page ("What's in the kit") for the two-part products.
// Copies the hardener/base photos from your UPDATED MOCKUPS folder into src/assets/kits/.
// Run from the project root:  node fix-kit-images.mjs
//   (if your mockups are somewhere else:  node fix-kit-images.mjs "D:\path\to\UPDATED MOCKUPS")
// Undo: git checkout . ; git clean -fd src
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const SRC = process.argv[2] || path.join(os.homedir(), "Documents", "UPDATED MOCKUPS");
// product id -> [label, file in the mockups folder, name used inside the project]  (null folder = already in src/assets/products)
const KITS = {
  "2k-acrylic-polyurethane": [["Base", null, "../assets/products/2K ACRYLIC POLYURETHANE BASE.png"], ["Hardener", null, "../assets/products/2K ACRYLIC POLYURETHANE HARDENER.png"]],
  "epoxy-2k-enamel": [["Base", "EPOXY 2K SOLVENT BASED.png", "epoxy-2k-base.png"], ["Hardener", "EPOXY SOLVENT BASED  HARDENER.png", "epoxy-2k-hardener.png"]],
  "epoxy-self-levelling": [["Base", "EPOXY SELF LEVELLING 2L.png", "epoxy-self-levelling-base.png"], ["Hardener", "EPOXY SELF LEVELLING HARDENER.png", "epoxy-self-levelling-hardener.png"]],
  "concrete-sealer": [["Base", "CONCRETE SEALER BASE 4L.png", "concrete-sealer-base.png"], ["Hardener", "CONCRETE SEALER HARDENER 1L.png", "concrete-sealer-hardener.png"]],
  "floxy-st-primer": [["Base", "ST PRIMER 4L TIN.png", "st-primer-base.png"], ["Hardener", "ST PRIMER HARDENER.png", "st-primer-hardener.png"]],
  "floxy-multipurpose-sealer": [["Base", "multipurpose sealer tin.png", "multipurpose-sealer-base.png"], ["Hardener", "multipurpose hardener-Photoroom.png", "multipurpose-sealer-hardener.png"]],
};

const COMPONENT = `import { B } from "../../data/theme.js";

// "What's in the kit": the base tin and the hardener tin shown together.
export default function KitStrip({ items }) {
  return (
    <div style={{ marginTop: 14, background: "#faf8f5", border: "1px solid #eee", borderRadius: 14, padding: "14px 16px 16px" }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#333", marginBottom: 10 }}>What is in the kit</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {items.map((it, i) => (
          <div key={it.label} style={{ display: "contents" }}>
            {i > 0 && <span aria-hidden="true" style={{ fontSize: 22, fontWeight: 300, color: B.coral }}>+</span>}
            <figure style={{ margin: 0, flex: "1 1 0", maxWidth: 190, textAlign: "center" }}>
              <div style={{ background: "#fff", borderRadius: 10, height: 130, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #eee" }}>
                <img src={it.src} alt={it.label} loading="lazy" style={{ maxHeight: 118, maxWidth: "90%", objectFit: "contain" }} />
              </div>
              <figcaption style={{ fontSize: 12.5, fontWeight: 600, color: "#555", marginTop: 6 }}>{it.label}</figcaption>
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

const problems = [], notes = [];
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
if (fs.existsSync("src/data/kitImages.js")) problems.push("This looks already applied");
const pdpPath = "src/pages/ProductDetailPage.jsx";
if (!fs.existsSync(pdpPath)) problems.push("Missing " + pdpPath);
if (!fs.existsSync(SRC)) problems.push("Cannot find the mockups folder: " + SRC + "  (give its path after the command)");

const copies = [], imports = [], entries = [];
let n = 0;
for (const [id, parts] of Object.entries(KITS)) {
  const items = [];
  for (const [label, file, name] of parts) {
    const v = "KIT_" + (++n);
    if (file === null) {
      if (!fs.existsSync("src/assets/products/" + path.basename(name))) { problems.push("Missing src/assets/products/" + path.basename(name)); continue; }
      imports.push('import ' + v + ' from "' + name.replace("../assets/", "../assets/") + '";');
    } else {
      const from = path.join(SRC, file);
      if (!fs.existsSync(from)) { problems.push("Missing photo: " + file); continue; }
      copies.push([from, path.join("src/assets/kits", name)]);
      imports.push('import ' + v + ' from "../assets/kits/' + name + '";');
    }
    items.push('{ label: "' + label + '", src: ' + v + ' }');
  }
  entries.push('  "' + id + '": [' + items.join(", ") + "],");
}
const KIT_DATA = "// Products that come as a base + hardener kit. Used by the \"What is in the kit\" strip on the product page.\n" + imports.join("\n") + "\n\nexport const KIT_IMAGES = {\n" + entries.join("\n") + "\n};\n";

let pdp = fs.existsSync(pdpPath) ? read(pdpPath) : "";
const once = (find, rep, what) => {
  const c = pdp.split(find).length - 1;
  if (c !== 1) problems.push(pdpPath + ": expected 1 match, found " + c + " for " + what); else pdp = pdp.replace(find, () => rep);
};
if (pdp) {
  once('import { checklistFor } from "../data/checklists.js";', 'import { checklistFor } from "../data/checklists.js";\nimport { KIT_IMAGES } from "../data/kitImages.js";\nimport KitStrip from "../components/products/KitStrip.jsx";', "the checklist import");
  once("\n          </div>\n\n          {/* Right: details and buy box */}", "\n            {KIT_IMAGES[product.id] && <KitStrip items={KIT_IMAGES[product.id]} />}\n          </div>\n\n          {/* Right: details and buy box */}", "the end of the picture column");
}
try {
  const esbuild = createRequire(import.meta.url)("esbuild");
  for (const [nm, c] of [[pdpPath, pdp], ["KitStrip.jsx", COMPONENT], ["kitImages.js", KIT_DATA]]) { if (!c) continue; try { esbuild.transformSync(c, { loader: "jsx" }); } catch (e) { problems.push("Syntax problem in " + nm + ": " + String(e.message).split("\n")[0]); } }
} catch { notes.push("esbuild not found, so no syntax check here; run npx eslint src afterwards"); }
if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }

fs.mkdirSync("src/assets/kits", { recursive: true });
fs.mkdirSync("src/components/products", { recursive: true });
for (const [a, b] of copies) fs.copyFileSync(a, b);
fs.writeFileSync("src/data/kitImages.js", KIT_DATA);
fs.writeFileSync("src/components/products/KitStrip.jsx", COMPONENT);
fs.writeFileSync(pdpPath, pdp);
console.log("\nDone. " + copies.length + " photos copied. The kit strip now shows on: " + Object.keys(KITS).join(", ") + ".");
notes.forEach(x => console.log("Note: " + x));
console.log("\nNext: npx eslint src, then npm run dev and open one of those products.\nUndo anytime with:  git checkout . ; git clean -fd src");
