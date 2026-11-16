// check-state.mjs  (READ ONLY: changes nothing)
// Run from the project root:   node check-state.mjs
// It tells you which of our changes are already in your code, and saves the lines I need for the remaining fixes to  for-claude-9.txt
// Send me that file (or paste its contents).

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const exists = f => fs.existsSync(f);
const read = f => (exists(f) ? fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n") : "");
const has = (f, s) => read(f).includes(s);
const walk = d => exists(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name).replace(/\\/g, "/")]) : [];
const src = walk("src").filter(f => /\.(jsx?|css)$/.test(f));
const sh = c => { try { return execSync(c, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return "(not available)"; } };

const out = [];
const say = s => { out.push(s); console.log(s); };
const row = (ok, label, hint) => say((ok ? "  [DONE]    " : "  [MISSING] ") + label + (ok || !hint ? "" : "   -> " + hint));

say("PEACOCK CODE CHECK  " + new Date().toISOString().slice(0, 10));
say("\nGit");
say("  branch: " + sh("git branch --show-current"));
say("  last commits:\n    " + sh("git log --oneline -4").split("\n").join("\n    "));
say("  not yet committed: " + (sh("git status --short") || "nothing"));
say("  not yet pushed to origin: " + (sh("git log origin/split-components..HEAD --oneline") || "nothing"));

say("\nEarlier changes");
row(has("src/styles/global.css", "mobile-fixes"), "Phone fixes (stacked colour page, slider swipe)", "node fix-mobile.mjs");
row(exists("src/utils/complement.js"), "Complementary colours");
row(exists("src/components/products/KitStrip.jsx"), "Hardener photos with the base");
row(exists("src/pages/ReviewsPage.jsx"), "Reviews page and single Feedback form");
row(has("src/data/products.catalogue.js", "0.5kg of powder"), "Skimmex 40 L per 20 kg wording", "node fix-wording.mjs");
row(has("src/data/estimatorProducts.js", "4 Sqm per litre"), "Epoxy Self Levelling 4 Sqm per litre", "node fix-wording.mjs");
row(exists("vercel.json") && has("vercel.json", "X-Content-Type-Options"), "Security headers (vercel.json)", "node add-security-headers.mjs");

say("\nLatest changes from the boss");
row(has("src/styles/global.css", "logo-out-of-pill"), "Bigger logo outside the pill", "node fix-final.mjs");
row(has("src/data/heroPhotos.js", "One model photo"), "Home slider uses ONE model photo", "node fix-final.mjs");
row(exists("src/pages/StartHerePage.jsx"), "'Where do I start?' page for new customers", "node fix-final.mjs");
row(src.some(f => /\.jsx$/.test(f) && has(f, 'nav("start-here")')), "'I don't know anything about Peacock Paints' button in the quote box", "node fix-final.mjs");
row(exists("src/components/samples/SampleDialog.jsx"), "Order colour samples prompt", "node fix-final.mjs");
row(exists("src/pages/VisualiserPage.jsx"), "Colour visualiser", "node add-visualiser.mjs (after fix-final.mjs)");
row(exists("src/components/colours/ScreenColourNote.jsx"), "'Colours on screen are a guide' note", "node add-visualiser.mjs");
const heroFiles = exists("src/assets/hero") ? fs.readdirSync("src/assets/hero") : [];
say("  photos in src/assets/hero: " + (heroFiles.join(", ") || "none"));

// lines needed for the fixes still to do
const detail = "src/pages/ProductDetailPage.jsx";
say("\n===== FOR CLAUDE (blobs on the product page) =====");
const lines = read(detail).split("\n");
const hits = [];
lines.forEach((l, i) => { if (/Select sizes|shades|Select Colour|CAT_SWATCH|PaintBlob|blob/i.test(l)) hits.push(i); });
say("lines in " + detail + " that mention colours, shades or blobs:");
const shown = new Set();
for (const i of hits) for (let k = Math.max(0, i - 2); k <= Math.min(lines.length - 1, i + 3); k++) shown.add(k);
[...shown].sort((a, b) => a - b).slice(0, 140).forEach(k => say(String(k + 1).padStart(4) + "  " + lines[k]));
say("\nfiles that import PaintBlob: " + (src.filter(f => has(f, "PaintBlob.jsx")).join(", ") || "none"));
say("files that mention a blob but do NOT import PaintBlob:");
src.filter(f => /blob/i.test(read(f)) && !has(f, "PaintBlob.jsx") && !/PaintBlob\.jsx$/.test(f)).forEach(f => say("  " + f));

say("\n===== FOR CLAUDE (delivery wording) =====");
src.filter(f => /\.jsx?$/.test(f)).forEach(f => read(f).split("\n").forEach((l, i) => { if (/deliver|3,000,000|3 million|3000000/i.test(l)) say(f + ":" + (i + 1) + "  " + l.trim().slice(0, 200)); }));

say("\n===== FOR CLAUDE (Hand Sanitiser / cleaning products) =====");
["src/data/products.catalogue.js", "src/data/navData.js"].forEach(f => read(f).split("\n").forEach((l, i) => { if (/sanitis|sanitiz|multi.?surface/i.test(l)) say(f + ":" + (i + 1) + "  " + l.trim().slice(0, 160)); }));

fs.writeFileSync("for-claude-9.txt", out.join("\n") + "\n");
console.log("\nSaved for-claude-9.txt. Please send it to me.");
