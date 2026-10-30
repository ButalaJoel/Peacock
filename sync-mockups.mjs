// Copies your mockups into the project and links each one to its product.
// Run from the project root:   node sync-mockups.mjs
//   (optional)                 node sync-mockups.mjs "D:\other\folder"
//
// Reads:   Documents\updated mockups   (or the folder you pass in)
// Writes:  public/products/*.png        clean file names, one per image
//          src/data/productImages.js    which image belongs to which product (and size)
//          src/data/productSheets.js    which product sheets (public/datasheets/*.pdf) exist
// Safe to run again whenever you add or replace mockups. Your original folder is never changed.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { execSync } from "node:child_process";
import crypto from "node:crypto";

const SRC = process.argv[2] || path.join(os.homedir(), "Documents", "updated mockups");
const CATALOGUE = "src/data/products.catalogue.js";
if (!fs.existsSync(SRC)) { console.error(`Cannot find the mockups folder: ${SRC}\nPass the folder as an argument:  node sync-mockups.mjs "C:\\path\\to\\folder"`); process.exit(1); }
if (!fs.existsSync(CATALOGUE)) { console.error(`Cannot find ${CATALOGUE}. Move products.catalogue.js into src/data/ first.`); process.exit(1); }

const { PRODUCTS } = await import(pathToFileURL(path.resolve(CATALOGUE)).href);
const packs = Object.fromEntries(PRODUCTS.map(p => [p.id, p.packSizes]));

// ───────── file name -> product rules (first match wins) ─────────
// [test on the normalised name (lowercase letters+digits only), product id, size or null, role]
// role: "img" = normal image, "skip" = deliberately not used
const S = "skip";
const RULES = [
  // not products / not used
  [k => k.startsWith("generalpackaging"), null, null, S],
  [k => k.startsWith("industrialwrapp"), null, null, S],
  [k => k.startsWith("roccarpet"), null, null, S],
  [k => k.startsWith("shifa"), null, null, S],
  [k => k.startsWith("4lemulsionbucketmockup"), null, null, S],
  [k => k.includes("hardener"), null, null, S],               // base tins only
  // generic wrapper for wood care products that have no tin of their own
  [k => k.startsWith("woodcaremockup"), "__woodcare_generic", null, "img"],

  // decorative
  [k => k.startsWith("vinylsilk"), "vinyl-silk-makula", null, "img"],
  [k => k.includes("weathershield"), "weathershield-plus", k => (/20l/.test(k) ? "20L" : null), "img"],
  [k => k.startsWith("premiummattemulsion"), "premium-matt", k => (/20l/.test(k) ? "20L" : /4l/.test(k) ? "4L" : null), "img"],
  [k => k.startsWith("undercoat4l"), "undercoat-emulsion", () => "4L", "img"],
  [k => k.startsWith("undercoatemulsion"), "undercoat-emulsion", k => (/20l/.test(k) ? "20L" : null), "img"],
  [k => k.startsWith("flatemulsion"), "flat-emulsion", k => (/20l/.test(k) ? "20L" : null), "img"],
  [k => k.startsWith("supermatt"), "super-matt-emulsion", k => (/20l/.test(k) ? "20L" : /4l/.test(k) ? "4L" : null), "img"],
  [k => k.startsWith("tilecoating"), "floxy-tile-coating", k => (/20l/.test(k) ? "20L" : null), "img"],
  [k => k.startsWith("undercoatputty"), "undercoat-putty", k => (/20kg/.test(k) ? "20kg" : null), "img"],
  [k => k.startsWith("pearlcoat"), "pearl-coat", () => "4L", "img"],
  [k => k.startsWith("latexprimer"), "latex-primer-sealer", k => (/20l/.test(k) ? "20L" : /4l/.test(k) ? "4L" : null), "img"],
  [k => k.startsWith("plasterprimer"), "plaster-primer", k => (/20l/.test(k) ? "20L" : null), "img"],
  [k => k.startsWith("bondaid"), "bond-aid", () => "5L", "img"],
  [k => k.startsWith("acrylicelastomeric") || k.startsWith("acrylicelastometric"), "acrylic-elastomeric-coating", k => (/20l/.test(k) ? "20L" : /4l/.test(k) ? "4L" : null), "img"],
  [k => k.includes("glossemulsion"), "gloss-emulsion", k => (/20l/.test(k) ? "20L" : null), "img"],
  [k => k.startsWith("mastic"), "mastic-textured-paint", null, "img"],
  [k => k.startsWith("stucco"), "venetian-stucco", k => (/20l/.test(k) ? "20kg" : null), "img"],
  [k => k.startsWith("acrylicartpallet"), "acrylic-art-pallet", k => (/1l/.test(k) ? "1L" : /4l/.test(k) ? "4L" : null), "img"],
  [k => k.startsWith("glazecoat"), "glaze-coat", k => (/20l/.test(k) ? "20L" : /4l/.test(k) ? "4L" : null), "img"],
  [k => k.startsWith("standardemulsion"), "standard-emulsion", k => (/20l/.test(k) ? "20L" : /4l/.test(k) ? "4L" : null), "img"],

  // industrial
  [k => k.startsWith("2kacrylicpolyurethane"), "2k-acrylic-polyurethane", null, "img"],
  [k => k.startsWith("autoacrylic"), "auto-acrylic", null, "img"],
  [k => k.startsWith("fastdry"), "fast-dry-enamel", null, "img"],
  [k => k.startsWith("epoxy2k"), "epoxy-2k-enamel", null, "img"],
  [k => k.startsWith("celluloseenamel"), "cellulose-enamel", null, "img"],
  [k => k.startsWith("epoxyselflevelling"), "epoxy-self-levelling", null, "img"],
  [k => k.startsWith("floxyhightemperature"), "floxy-high-temperature-resistant-coating", null, "img"],
  [k => k.startsWith("multipurposesealer"), "floxy-multipurpose-sealer", null, "img"],
  [k => k.startsWith("stprimer"), "floxy-st-primer", null, "img"],
  [k => k.startsWith("roadmarking"), "road-marking-paint", k => (/20l/.test(k) ? "20L" : null), "img"],
  [k => k.startsWith("supergloss"), "super-gloss", null, "img"],
  [k => k.startsWith("standardhigloss"), "standard-hi-gloss", k => (/20l/.test(k) ? "20L" : null), "img"],
  [k => k.startsWith("thermoplastic") || k.startsWith("rdenamel"), "rd-enamel", null, "img"],
  [k => k.startsWith("peacockundercoatoil"), "undercoat-oil", k => (/20l/.test(k) ? "20L" : null), "img"],
  [k => k.startsWith("concretesealer"), "concrete-sealer", null, "img"],
  [k => k.startsWith("tarmul") || k.startsWith("bituminous"), "bituminous-emulsion", k => (/12l/.test(k) ? "12L" : /4l/.test(k) ? "4L" : null), "img"],
  [k => k.startsWith("metalprimer"), "metal-primer", null, "img"],
  [k => k.startsWith("skimmex") || k.startsWith("skimex"), "skimmex", null, "img"],
  [k => k.startsWith("waterproofplaster") || k.startsWith("waterproofmockup"), "waterproof-plaster", null, "img"],
  [k => k.startsWith("aquaphob"), "aquaphob", null, "img"],
  [k => k.startsWith("episive"), "episive", null, "img"],
  [k => k.startsWith("mbasecoat"), "m-basecoat-aluminium", null, "img"],
  [k => k.startsWith("polatex"), "polatex", null, "img"],
  [k => k.startsWith("handsanitizer"), "hand-sanitizer", null, "img"],

  // wood care
  [k => k.startsWith("ncsandingsealer"), "nc-sanding-sealer", null, "img"],
  [k => k.startsWith("premiumlacquer"), "premium-lacquer", null, "img"],
  [k => k.startsWith("clearvarnish"), "clear-varnish", null, "img"],
  [k => k.startsWith("woodjoinery") || k.startsWith("woodglue") || k.startsWith("tuffhold"), "tuff-hold-joinery-glue", null, "img"],

  // thinners
  [k => k.startsWith("urethh") || k.startsWith("urethane"), "urethane-thinner", null, "img"],
  [k => k.startsWith("epoxythinner"), "epoxy-thinner", null, "img"],
  [k => k.startsWith("syncthinner"), "sync-thinner", null, "img"],
  [k => k.startsWith("multisurface"), "multi-surface-industrial-cleaner", null, "img"],
];
const GENERIC_WOODCARE_FOR = ["clear-varnish", "1k-polyurethane-varnish", "2k-polyurethane-varnish"];

// ───────── read the folder ─────────
const IMG_EXT = /\.(png|jpe?g|webp)$/i;
const files = fs.readdirSync(SRC).filter(f => IMG_EXT.test(f)).sort((a, b) => a.localeCompare(b));
const norm = f => f.replace(/\.[^.]+$/, "").toLowerCase().replace(/photoroom/g, "").replace(/[^a-z0-9]/g, "");

const byProduct = {};       // id -> [{ file, size, order }]
const skipped = [], unknown = [], duplicates = [];
let genericFile = null;
for (const f of files) {
  const k = norm(f);
  const rule = RULES.find(r => r[0](k));
  if (!rule) { unknown.push(f); continue; }
  const [, id, sizeFn, role] = rule;
  if (role === "skip") { skipped.push(f); continue; }
  if (id === "__woodcare_generic") { genericFile = f; continue; }
  const size = typeof sizeFn === "function" ? sizeFn(k) : sizeFn;
  const hash = crypto.createHash("md5").update(fs.readFileSync(path.join(SRC, f))).digest("hex");
  const list = (byProduct[id] ||= []);
  const dup = list.find(i => i.hash === hash);
  if (dup) { duplicates.push(`${f}  (same picture as ${dup.file})`); continue; }
  list.push({ file: f, size, hash });
}

const ids = new Set(PRODUCTS.map(p => p.id));
for (const id of Object.keys(byProduct)) if (!ids.has(id)) { console.error(`Rule points to unknown product id: ${id}`); process.exit(1); }

// ───────── copy + build the manifest ─────────
const OUT = "public/products";
fs.mkdirSync(OUT, { recursive: true });
const copy = (file, name) => {
  const ext = path.extname(file).toLowerCase();
  fs.copyFileSync(path.join(SRC, file), path.join(OUT, name + ext));
  return `/products/${name}${ext}`;
};

const manifest = {};
const usedNames = [];
for (const [id, items] of Object.entries(byProduct)) {
  // main image: an unsized one if there is one, else the 4L, else the first
  const main = items.find(i => i.size && i.size === packs[id][0]) || items.find(i => !i.size) || items.find(i => i.size === "4L") || items[0];
  const entry = { main: copy(main.file, id), bySize: {}, gallery: [] };
  usedNames.push(`${id}${path.extname(main.file).toLowerCase()}`);
  for (const it of items) {
    if (it === main) continue;
    const valid = it.size && packs[id].includes(it.size) && !entry.bySize[it.size];
    const name = valid ? `${id}--${it.size}` : `${id}--g${entry.gallery.length + 1}`;
    const url = copy(it.file, name);
    usedNames.push(path.basename(url));
    if (valid) entry.bySize[it.size] = url; else entry.gallery.push(url);
  }
  // a sized main image also answers for its own size
  if (main.size && packs[id].includes(main.size)) entry.bySize[main.size] = entry.main;
  manifest[id] = entry;
}
let genericUrl = null;
if (genericFile) {
  genericUrl = copy(genericFile, "woodcare-generic");
  usedNames.push(path.basename(genericUrl));
  for (const id of GENERIC_WOODCARE_FOR) if (!manifest[id]) manifest[id] = { main: genericUrl, bySize: {}, gallery: [], generic: true };
}

// remove old copies that no longer match anything (so renamed/removed mockups do not linger)
for (const f of fs.readdirSync(OUT)) if (!usedNames.includes(f)) fs.rmSync(path.join(OUT, f));

fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync("src/data/productImages.js",
`// Generated by sync-mockups.mjs - do not edit by hand. Re-run the script after changing the mockups folder.
// main = default image, bySize = image to show for a pack size, gallery = extra images, generic = shared wrapper.
export const PRODUCT_IMAGES = ${JSON.stringify(manifest, null, 2)};
`, "utf8");

// ───────── product sheets (public/datasheets/<id>.pdf) ─────────
const SHEETS = "public/datasheets";
const zip = path.join(os.homedir(), "Downloads", "product-sheets.zip");
const havePdfs = () => fs.existsSync(SHEETS) && fs.readdirSync(SHEETS).some(f => f.toLowerCase().endsWith(".pdf"));
let sheetNote = "";
if (!havePdfs() && fs.existsSync(zip) && process.platform === "win32") {
  try {
    const tmp = path.join(os.tmpdir(), "peacock-sheets");
    execSync(`powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zip}' -DestinationPath '${tmp}' -Force"`, { stdio: "ignore" });
    const inner = fs.existsSync(path.join(tmp, "sheets")) ? path.join(tmp, "sheets") : tmp;
    fs.mkdirSync(SHEETS, { recursive: true });
    for (const f of fs.readdirSync(inner)) if (f.toLowerCase().endsWith(".pdf")) fs.copyFileSync(path.join(inner, f), path.join(SHEETS, f));
    sheetNote = "Unzipped product-sheets.zip from your Downloads folder into public/datasheets/.";
  } catch { sheetNote = "Could not unzip product-sheets.zip automatically: unzip it by hand and put the PDFs in public/datasheets/."; }
}
const sheetIds = havePdfs() ? fs.readdirSync(SHEETS).filter(f => f.toLowerCase().endsWith(".pdf")).map(f => f.replace(/\.pdf$/i, "")).filter(id => ids.has(id)).sort() : [];
fs.writeFileSync("src/data/productSheets.js",
`// Generated by sync-mockups.mjs - ids that have a PDF in public/datasheets/. Re-run the script after adding or removing PDFs.
export const PRODUCT_SHEETS = ${JSON.stringify(sheetIds, null, 2)};
`, "utf8");

// ───────── report ─────────
const withImg = PRODUCTS.filter(p => manifest[p.id]);
const without = PRODUCTS.filter(p => !manifest[p.id]);
console.log(`\nMockups folder: ${SRC}`);
console.log(`${files.length} images found -> ${usedNames.length} copied to public/products/`);
console.log(`\n${withImg.length} of ${PRODUCTS.length} products have an image.`);
const generic = Object.entries(manifest).filter(([, m]) => m.generic).map(([id]) => id);
if (generic.length) console.log(`  using the shared wood care wrapper: ${generic.join(", ")}`);
const multi = Object.entries(manifest).filter(([, m]) => Object.keys(m.bySize).length > 1 || m.gallery.length);
console.log(`  ${multi.length} products have more than one image (size images and gallery).`);
if (without.length) console.log(`\nNo image yet:\n  ${without.map(p => p.name).join("\n  ")}`);
if (skipped.length) console.log(`\nSkipped on purpose (${skipped.length}): hardeners, generic wrappers, Roc Carpet, Shifa...`);
if (duplicates.length) console.log(`\nIdentical pictures ignored (${duplicates.length}):\n  ${duplicates.join("\n  ")}`);
if (unknown.length) console.log(`\nNot matched to any product (${unknown.length}) - tell Claude what these are:\n  ${unknown.join("\n  ")}`);
const sizeMismatch = Object.entries(byProduct).flatMap(([id, items]) => items.filter(i => i.size && !packs[id].includes(i.size)).map(i => `${id}: image says ${i.size}, catalogue packs are ${packs[id].join(", ")}`));
if (sizeMismatch.length) console.log(`\nSize differs from the catalogue (kept as extra images):\n  ${sizeMismatch.join("\n  ")}`);
console.log(`\nProduct sheets found: ${sheetIds.length} ${sheetNote}`);
console.log("\nNext: node wire-catalogue.mjs");
