// Stage 4a: split the main component into a shared-state provider, layout components and home sections.
// Run from the project root:  node split-stage4.mjs
//
// Behaviour stays IDENTICAL: same state, same handlers, same JSX - only moved into files.
// Creates:
//   src/context/AppContext.jsx          (all shared state + handlers; useApp() hook)
//   src/components/layout/              AppShell, AnnouncementBar, Header, SearchModal, CartDrawer, MobileMenu, Footer
//   src/components/home/                Hero, DoorsSection, TrendingColours, ProductCatalogue, Newsletter, InfoCards
//   src/pages/                          HomePage, PageSwitch, StoryPage
// and rewrites src/PeacockPaintsWebsite.jsx into a ~12 line wrapper.
// Nothing is written unless every check passes. Undo anytime with:  git checkout . ; git clean -fd src

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const SRC = "src/PeacockPaintsWebsite.jsx";
if (!fs.existsSync(SRC)) { console.error(`Cannot find ${SRC}. Run this from the project root.`); process.exit(1); }
if (fs.existsSync("src/context/AppContext.jsx")) { console.error("src/context/AppContext.jsx already exists - stage 4a looks done."); process.exit(1); }

const original = fs.readFileSync(SRC, "utf8").replace(/\r\n/g, "\n");
const lines = original.split("\n");
const problems = [];
const fail = m => problems.push(m);

// ───────────── 1. imports of the original file ─────────────
const importMap = {}; // name -> { src, def }
for (const l of lines) {
  let m;
  if (/^import .* from "react";$/.test(l)) continue;
  if ((m = l.match(/^import \{ (.+) \} from "(\.[^"]+)";$/))) m[1].split(",").map(s => s.trim()).forEach(n => (importMap[n] = { src: m[2], def: false }));
  else if ((m = l.match(/^import (\w+) from "(\.[^"]+)";$/))) importMap[m[1]] = { src: m[2], def: true };
}

// ───────────── 2. find the component ─────────────
const S = lines.findIndex(l => l === "export default function PeacockPaintsWebsite() {");
let E = -1; for (let i = lines.length - 1; i >= 0; i--) if (lines[i] === "}") { E = i; break; }
if (S < 0 || E < S) { console.error("Could not find the PeacockPaintsWebsite component."); process.exit(1); }
const topLevelExtra = lines.slice(0, S).filter(l => /^(const|let|function) /.test(l));
if (topLevelExtra.length) fail("Found top-level declarations outside the component: " + topLevelExtra[0].slice(0, 60));

const body = lines.slice(S + 1, E);
const retIdx = body.findIndex(l => l === "  return (");
if (retIdx < 0) { console.error('Could not find "  return (" inside the component.'); process.exit(1); }
const pre = body.slice(0, retIdx);
let jsx = body.slice(retIdx + 1);
while (jsx.length && jsx[jsx.length - 1].trim() === "") jsx.pop();
if (jsx.pop() !== "  );") fail('Expected the component to end with "  );"');

// ───────────── 3. statements before the return ─────────────
const START = /^  (const |let |function |useEffect\(|useLayoutEffect\()/;
const stmts = [];
let cur = null, pending = [];
for (const l of pre) {
  if (START.test(l)) { cur = { lead: pending, lines: [l] }; pending = []; stmts.push(cur); }
  else if (/^  \/\//.test(l)) pending.push(l);
  else if (l.trim() === "" && pending.length) pending.push(l);
  else if (cur) { cur.lines.push(...pending, l); pending = []; }
}
for (const s of stmts) {
  while (s.lines.length && s.lines[s.lines.length - 1].trim() === "") s.lines.pop();
  const lead = s.lead.length ? s.lead.join("\n").replace(/\n+$/, "") + "\n" : "";
  s.text = lead + s.lines.join("\n");
  const first = s.lines[0];
  let m;
  if ((m = first.match(/^  const \[([^\]]+)\]\s*=/))) s.names = m[1].split(",").map(x => x.trim());
  else if ((m = first.match(/^  (?:const|let|function)\s+(\w+)/))) s.names = [m[1]];
  else s.names = [];
}

const HERO = new Set(["heroSlides", "currentHero", "openHeroProductGrid", "shopHeroProducts", "exploreHero", "showHeroSlide", "openHeroSwatch", "heroSlide", "setHeroSlide", "heroPaused", "setHeroPaused"]);
const heroStmts = [], providerStmts = [];
let storyStmt = null;
for (const s of stmts) {
  if (s.names.includes("renderStory")) storyStmt = s;
  else if (s.names.some(n => HERO.has(n)) || (s.names.length === 0 && /heroPaused/.test(s.text))) heroStmts.push(s);
  else providerStmts.push(s);
}
const foundHero = new Set(heroStmts.flatMap(s => s.names));
for (const n of HERO) if (!foundHero.has(n)) fail(`Expected hero statement "${n}" but did not find it`);
if (!storyStmt) fail("Could not find renderStory");
if (heroStmts.length < 8) fail("Hero statements look wrong");
const providerNames = providerStmts.flatMap(s => s.names);

// ───────────── 4. JSX segments ─────────────
const rootOpen = jsx[0];
if (!/^    <div style=/.test(rootOpen)) fail("Root element is not the expected <div style=...>");
if (jsx[jsx.length - 1] !== "    </div>") fail("Root element does not end with </div>");
const kids = jsx.slice(1, -1);
const wanted = ["Top Bar", "Header", "Search", "Cart Drawer", "Mobile Menu", "═══ PAGES ═══", "Footer"];
const markIdx = wanted.map(w => kids.findIndex(l => l === `      {/* ${w} */}`));
wanted.forEach((w, i) => { if (markIdx[i] < 0) fail(`Missing marker comment {/* ${w} */}`); });
if (markIdx.some((x, i) => i && x <= markIdx[i - 1])) fail("Marker comments are not in the expected order");
const seg = {};
if (!problems.length) {
  wanted.forEach((w, i) => {
    const end = i + 1 < wanted.length ? markIdx[i + 1] : kids.length;
    const part = kids.slice(markIdx[i] + 1, end);
    while (part.length && part[part.length - 1].trim() === "") part.pop();
    seg[w] = part;
  });
}

// home branch inside the pages segment
let pagesLines = seg["═══ PAGES ═══"] || [];
const elseStart = pagesLines.findIndex(l => l === "      ) : (<>");
const elseEnd = pagesLines.findIndex((l, i) => i > elseStart && l === "      </>)}");
if (elseStart < 0 || elseEnd < 0) fail('Could not find the home branch ("      ) : (<>" ... "      </>)}")');
const homeKids = pagesLines.slice(elseStart + 1, elseEnd);
const homeParts = [];
if (!problems.length) {
  let current = null, prevWasComment = false;
  for (const l of homeKids) {
    const isComment = /^        \{\/\* .* \*\/\}$/.test(l);
    const isSection = /^        <section/.test(l);
    if (isComment) { current = { lines: [l] }; homeParts.push(current); prevWasComment = true; }
    else if (isSection && !prevWasComment) { current = { lines: [l] }; homeParts.push(current); prevWasComment = false; }
    else if (current) { current.lines.push(l); if (l.trim() !== "") prevWasComment = false; }
    if (isSection) prevWasComment = false;
  }
  homeParts.forEach(p => { while (p.lines.length && p.lines[p.lines.length - 1].trim() === "") p.lines.pop(); });
  const marks = [["Hero", "paint-hero"], ["DoorsSection", 'className="doors"'], ["TrendingColours", "Our trending colours"],
                 ["ProductCatalogue", "Our complete product range"], ["Newsletter", "Inspiration in your inbox"], ["InfoCards", "We're here for you"]];
  if (homeParts.length !== 6) fail(`Expected 6 home sections but found ${homeParts.length}`);
  else marks.forEach(([n, needle], i) => { if (!homeParts[i].lines.join("\n").includes(needle)) fail(`Home section ${i + 1} should be ${n} but does not contain: ${needle}`); else homeParts[i].name = n; });
}

if (problems.length) { console.error("\nStopped. Nothing was changed because of these problems:\n"); problems.forEach(p => console.error("  - " + p)); console.error("\nCopy this message and send it to Claude."); process.exit(1); }

// ───────────── 5. helpers ─────────────
function codeOnly(t) {
  return t
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/`([^`]*)`/g, (_, s) => [...s.matchAll(/\$\{([^}]*)\}/g)].map(m => m[1]).join(" "))
    .replace(/"[^"\n]*"/g, '""')
    .replace(/'[^'\n]*'/g, "''")
    .replace(/\.\.\./g, " ")
    .replace(/<\/?[a-z][\w.]*/g, "<");
}
const uses = (code, n) => new RegExp(`(?<![\\w$.])${n.replace(/\$/g, "\\$")}(?![\\w$])`).test(code);

function relImport(fromFile, toSrc /* like ./data/x.js relative to src/ */) {
  const target = path.posix.join("src", toSrc);
  let rel = path.posix.relative(path.posix.dirname(fromFile), target);
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

function importBlock(file, text, { ctx = false, extraReact = [] } = {}) {
  const code = codeOnly(text);
  const out = [];
  const hooks = ["createContext", "useContext", "useState", "useEffect", "useRef"].filter(h => extraReact.includes(h) || uses(code, h));
  if (hooks.length) out.push(`import { ${hooks.join(", ")} } from "react";`);
  const bySrc = {}; const defaults = [];
  for (const [name, info] of Object.entries(importMap)) {
    if (!uses(code, name)) continue;
    if (info.def) defaults.push(`import ${name} from "${relImport(file, info.src)}";`);
    else (bySrc[info.src] ||= []).push(name);
  }
  for (const [s, names] of Object.entries(bySrc)) out.push(`import { ${names.join(", ")} } from "${relImport(file, s)}";`);
  out.push(...defaults);
  if (ctx) out.push(`import { useApp } from "${relImport(file, "./context/AppContext.jsx")}";`);
  return out.join("\n");
}

function ctxNames(text) {
  const code = codeOnly(text);
  return providerNames.filter(n => uses(code, n));
}

const outputs = {};

function component({ file, name, segmentLines, statements = [], wrapFragment = true }) {
  const segText = segmentLines.join("\n");
  const stmtText = statements.map(s => s.text).join("\n\n");
  const all = segText + "\n" + stmtText;
  const names = ctxNames(all);
  const imports = importBlock(file, all, { ctx: names.length > 0 });
  const head = names.length ? `  const { ${names.join(", ")} } = useApp();\n` : "";
  const mid = stmtText ? stmtText + "\n\n" : "";
  const ret = wrapFragment
    ? `  return (\n    <>\n${segText}\n    </>\n  );`
    : `  return (\n${segText}\n  );`;
  outputs[file] = `${imports ? imports + "\n\n" : ""}export default function ${name}() {\n${head}${mid}${ret}\n}\n`;
}

// ───────────── 6. layout components ─────────────
component({ file: "src/components/layout/AnnouncementBar.jsx", name: "AnnouncementBar", segmentLines: seg["Top Bar"] });
component({ file: "src/components/layout/Header.jsx", name: "Header", segmentLines: seg["Header"] });
component({ file: "src/components/layout/SearchModal.jsx", name: "SearchModal", segmentLines: seg["Search"] });
component({ file: "src/components/layout/CartDrawer.jsx", name: "CartDrawer", segmentLines: seg["Cart Drawer"] });
component({ file: "src/components/layout/MobileMenu.jsx", name: "MobileMenu", segmentLines: seg["Mobile Menu"] });
component({ file: "src/components/layout/Footer.jsx", name: "Footer", segmentLines: seg["Footer"] });

// ───────────── 7. home sections ─────────────
for (const p of homeParts) {
  const stmts = p.name === "Hero" ? heroStmts : [];
  component({ file: `src/components/home/${p.name}.jsx`, name: p.name, segmentLines: p.lines, statements: stmts });
}
outputs["src/pages/HomePage.jsx"] =
  `import Hero from "../components/home/Hero.jsx";\nimport DoorsSection from "../components/home/DoorsSection.jsx";\nimport TrendingColours from "../components/home/TrendingColours.jsx";\nimport ProductCatalogue from "../components/home/ProductCatalogue.jsx";\nimport Newsletter from "../components/home/Newsletter.jsx";\nimport InfoCards from "../components/home/InfoCards.jsx";\n\n` +
  `export default function HomePage() {\n  return (\n    <>\n      <Hero />\n      <DoorsSection />\n      <TrendingColours />\n      <ProductCatalogue />\n      <Newsletter />\n      <InfoCards />\n    </>\n  );\n}\n`;

// ───────────── 8. page switch + story page ─────────────
let switchLines = [...pagesLines.slice(0, elseStart), "      ) : (", "        <HomePage />", "      )}", ...pagesLines.slice(elseEnd + 1)];
const rsCount = switchLines.filter(l => l.includes("{renderStory(pg)}")).length;
if (rsCount !== 1) { console.error('Expected exactly one "{renderStory(pg)}" in the pages section, found ' + rsCount); process.exit(1); }
switchLines = switchLines.map(l => l.replace("{renderStory(pg)}", "<StoryPage pageKey={pg} />"));
{
  const file = "src/pages/PageSwitch.jsx";
  const segText = switchLines.join("\n");
  const names = ctxNames(segText);
  let imports = importBlock(file, segText, { ctx: names.length > 0 });
  imports += `\nimport HomePage from "./HomePage.jsx";\nimport StoryPage from "./StoryPage.jsx";`;
  outputs[file] = `${imports}\n\nexport default function PageSwitch() {\n  const { ${names.join(", ")} } = useApp();\n  return (\n    <>\n${segText}\n    </>\n  );\n}\n`;
}
{
  const file = "src/pages/StoryPage.jsx";
  const names = ctxNames(storyStmt.text);
  const imports = importBlock(file, storyStmt.text, { ctx: names.length > 0 });
  outputs[file] = `${imports}\n\nexport default function StoryPage({ pageKey }) {\n${names.length ? `  const { ${names.join(", ")} } = useApp();\n` : ""}${storyStmt.text}\n\n  return renderStory(pageKey);\n}\n`;
}

// ───────────── 9. AppShell ─────────────
outputs["src/components/layout/AppShell.jsx"] =
  `import AnnouncementBar from "./AnnouncementBar.jsx";\nimport Header from "./Header.jsx";\nimport SearchModal from "./SearchModal.jsx";\nimport CartDrawer from "./CartDrawer.jsx";\nimport MobileMenu from "./MobileMenu.jsx";\nimport Footer from "./Footer.jsx";\nimport PageSwitch from "../../pages/PageSwitch.jsx";\n\n` +
  `export default function AppShell() {\n  return (\n${rootOpen}\n      <AnnouncementBar />\n      <Header />\n      <SearchModal />\n      <CartDrawer />\n      <MobileMenu />\n      <PageSwitch />\n      <Footer />\n    </div>\n  );\n}\n`;

// ───────────── 10. provider ─────────────
{
  const file = "src/context/AppContext.jsx";
  const stmtText = providerStmts.map(s => s.text).join("\n\n");
  const imports = importBlock(file, stmtText, { extraReact: ["createContext", "useContext"] });
  outputs[file] =
    `${imports}\n\nconst AppContext = createContext(null);\n\n` +
    `export const useApp = () => {\n  const value = useContext(AppContext);\n  if (!value) throw new Error("useApp must be used inside <AppProvider>");\n  return value;\n};\n\n` +
    `export function AppProvider({ children }) {\n${stmtText}\n\n  const value = {\n    ${providerNames.join(",\n    ")},\n  };\n\n  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;\n}\n`;
}

// ───────────── 11. new main file ─────────────
const newMain =
`import { AppProvider } from "./context/AppContext.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import "./styles/global.css";

export default function PeacockPaintsWebsite() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
`;

// ───────────── 12. checks before writing ─────────────
// every original line must still exist somewhere (except the few we replaced on purpose)
const generatedText = Object.values(outputs).join("\n");
const have = new Set(generatedText.split("\n").map(l => l.trim()).filter(Boolean));
const allowedMiss = new Set(["{/* Top Bar */}", "{/* Header */}", "{/* Search */}", "{/* Cart Drawer */}", "{/* Mobile Menu */}", "{/* ═══ PAGES ═══ */}", "{/* Footer */}", ") : (<>", "</>)}", "{renderStory(pg)}"]);
const missing = [];
for (const l of [...pre, ...jsx]) {
  const t = l.trim().replace("{renderStory(pg)}", "<StoryPage pageKey={pg} />");
  if (!t || have.has(t) || allowedMiss.has(t)) continue;
  if (/^\/\/ /.test(t)) continue; // comments between statements
  missing.push(t);
}
if (missing.length) fail(`${missing.length} original line(s) were not found in the new files, e.g.: ${missing.slice(0, 3).map(s => s.slice(0, 70)).join("  |  ")}`);
// every statement must be present in exactly one place
for (const s of stmts) if (!generatedText.includes(s.text)) fail(`Statement lost: ${s.lines[0].trim().slice(0, 60)}`);

let esbuild = null;
try { esbuild = createRequire(path.resolve("package.json"))("esbuild"); } catch { console.log("(esbuild not found - skipped syntax check)"); }
if (esbuild) {
  for (const [f, c] of [...Object.entries(outputs), [SRC, newMain]]) {
    try { esbuild.transformSync(c, { loader: "jsx" }); }
    catch (e) { fail(`${f} would have a syntax error: ${String(e.message).split("\n").slice(0, 3).join(" ")}`); }
  }
}
if (problems.length) { console.error("\nStopped. Nothing was changed because of these problems:\n"); problems.forEach(p => console.error("  - " + p)); console.error("\nCopy this message and send it to Claude."); process.exit(1); }

// ───────────── 13. write ─────────────
for (const [f, c] of Object.entries(outputs)) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, c, "utf8"); }
fs.writeFileSync(SRC, newMain, "utf8");

console.log("\nCreated:\n");
for (const [f, c] of Object.entries(outputs)) console.log(`  ${f.padEnd(46)} ${String(c.split("\n").length - 1).padStart(4)} lines`);
console.log(`\nPeacockPaintsWebsite.jsx: ${lines.length} lines -> ${newMain.split("\n").length - 1} lines`);
console.log(`Shared via useApp(): ${providerNames.length} values (state, handlers, helpers)`);
console.log("\nNext:\n  1. npm run dev  and click through the site\n  2. npx eslint src   (finds any name a file uses but does not have)");
console.log("Undo anytime with:  git checkout . ; git clean -fd src");
