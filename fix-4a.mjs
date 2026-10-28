// Fixes the two problems ESLint found after stage 4a:
//   1. openHeroProductGrid lived in Hero.jsx but the header menu (in AppContext) also calls it.
//      -> moved into AppContext so both can use it. (This was a real bug: "All specialist paints" would crash.)
//   2. useApp() shared a file with AppProvider, which breaks fast refresh.
//      -> moved useApp into src/context/useApp.js and updated every import.
// Run from the project root:  node fix-4a.mjs      Undo with:  git checkout . ; git clean -fd src

import fs from "node:fs";
import path from "node:path";

const HERO = "src/components/home/Hero.jsx";
const CTX = "src/context/AppContext.jsx";
const problems = [];
for (const f of [HERO, CTX]) if (!fs.existsSync(f)) problems.push(`Missing ${f}`);
if (fs.existsSync("src/context/useApp.js")) problems.push("src/context/useApp.js already exists - this fix looks done");
if (problems.length) { console.error("Stopped:\n  - " + problems.join("\n  - ")); process.exit(1); }

let hero = fs.readFileSync(HERO, "utf8").replace(/\r\n/g, "\n");
let ctx = fs.readFileSync(CTX, "utf8").replace(/\r\n/g, "\n");

// ---------- 1. move openHeroProductGrid ----------
const re = /^  const openHeroProductGrid = [\s\S]*?^  \};\n/m;
const m = hero.match(re);
if (!m) problems.push("Could not find openHeroProductGrid in Hero.jsx");
const stmt = m ? m[0].replace(/\n+$/, "") : "";
if (m) hero = hero.replace(re, "").replace(/\n{3,}/g, "\n\n");

// provider: insert before handleMegaFooter (or before the value object)
let anchor = ctx.indexOf("  const handleMegaFooter");
if (anchor < 0) anchor = ctx.indexOf("  const value = {");
if (anchor < 0) problems.push("Could not find where to insert in AppContext.jsx");
if (ctx.includes("const openHeroProductGrid")) problems.push("AppContext.jsx already defines openHeroProductGrid");
if (anchor >= 0 && stmt) ctx = ctx.slice(0, anchor) + stmt + "\n\n" + ctx.slice(anchor);
if (!ctx.includes("    openHeroProductGrid,")) ctx = ctx.replace(/(  const value = \{\n)/, "$1    openHeroProductGrid,\n");

// Hero: fix the useApp() destructuring (drop names no longer used, add the new one)
const dm = hero.match(/^  const \{ ([^}]+) \} = useApp\(\);$/m);
if (!dm) problems.push("Could not find the useApp() line in Hero.jsx");
else {
  const rest = hero.replace(dm[0], "").replace(/^import .*$/gm, "");
  const strip = t => t.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/^\s*\/\/.*$/gm, "").replace(/"[^"\n]*"/g, '""');
  const code = strip(rest);
  const used = n => new RegExp(`(?<![\\w$.])${n}(?![\\w$])`).test(code);
  const names = dm[1].split(",").map(s => s.trim()).filter(used);
  if (!names.includes("openHeroProductGrid") && used("openHeroProductGrid")) names.push("openHeroProductGrid");
  hero = hero.replace(dm[0], `  const { ${names.join(", ")} } = useApp();`);
}

// ---------- 2. split useApp out of AppContext.jsx ----------
const block = `const AppContext = createContext(null);

export const useApp = () => {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside <AppProvider>");
  return value;
};

`;
if (!ctx.includes(block)) problems.push("The useApp block in AppContext.jsx is not in the expected form");
else ctx = ctx.replace(block, "");
const rm = ctx.match(/^import \{ ([^}]+) \} from "react";$/m);
if (rm) {
  const keep = rm[1].split(",").map(s => s.trim()).filter(n => !["createContext", "useContext"].includes(n));
  ctx = ctx.replace(rm[0], `import { ${keep.join(", ")} } from "react";\nimport { AppContext } from "./useApp.js";`);
} else problems.push("Could not find the react import in AppContext.jsx");

if (problems.length) { console.error("\nStopped. Nothing was changed because of these problems:\n"); problems.forEach(p => console.error("  - " + p)); console.error("\nCopy this message and send it to Claude."); process.exit(1); }

fs.writeFileSync("src/context/useApp.js",
`import { createContext, useContext } from "react";

export const AppContext = createContext(null);

export const useApp = () => {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside <AppProvider>");
  return value;
};
`, "utf8");
fs.writeFileSync(HERO, hero, "utf8");
fs.writeFileSync(CTX, ctx, "utf8");

// update every import of useApp
let changed = 0;
const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) { if (e.name !== "assets") walk(p); return; }
  if (!/\.jsx?$/.test(e.name)) return;
  const t = fs.readFileSync(p, "utf8");
  const n = t.replace(/^(import \{ useApp \} from ")([^"]*)context\/AppContext\.jsx(";)$/gm, "$1$2context/useApp.js$3");
  if (n !== t) { fs.writeFileSync(p, n, "utf8"); changed++; }
});
walk("src");

console.log(`\nDone.\n  - openHeroProductGrid moved into AppContext.jsx\n  - useApp moved to src/context/useApp.js (${changed} files updated)\n`);
console.log("Next: run  npx eslint src  (should report no errors), then  npm run dev  and test:");
console.log("  Paints menu -> All specialist paints   (this used to crash)");
