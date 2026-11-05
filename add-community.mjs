// Community & Foundation: a new "Community" category in News & updates, plus its own page  #/community
// (community projects, sponsorships, donations). You post to it from the dashboard: News & updates -> category Community.
// Needs 05-peacock-community.sql to have been run in Supabase first.
// Run from the project root AFTER add-site-links.mjs:  node add-community.mjs
// EDITS: src/data/updates.js, src/lib/useUpdates.js, src/dashboard/NewsAdmin.jsx, src/pages/NewsPage.jsx, src/pages/PageSwitch.jsx,
//        src/data/navData.js (Inspiration menu), src/components/layout/Footer.jsx
// Undo: git checkout . ; git clean -fd src
import fs from "node:fs";
import { createRequire } from "node:module";

const EDITS = {
  "src/data/updates.js": [
    ['export const UPDATE_CATEGORIES = ["Product news", "Colour tips", "Company"];', 'export const UPDATE_CATEGORIES = ["Product news", "Colour tips", "Company", "Community"];'],
  ],
  "src/lib/useUpdates.js": [
    ['"Newsletter": "#1a3a5c" };', '"Newsletter": "#1a3a5c", "Community": "#1F6F78" };'],
  ],
  "src/dashboard/NewsAdmin.jsx": [
    ['const CATS = ["Product news", "Colour tips", "Company", "Newsletter"];', 'const CATS = ["Product news", "Colour tips", "Company", "Community", "Newsletter"];'],
  ],
  "src/pages/NewsPage.jsx": [
    ['export default function NewsPage() {', 'export default function NewsPage({ initialCat = "All" }) {'],
    ['const [cat, setCat] = useState("All");', 'const [cat, setCat] = useState(initialCat);'],
    ['<PageHero kicker="Advice" title="News & Updates" subtitle="Product news, colour tips and updates from Peacock Paints."', '<PageHero kicker={initialCat === "Community" ? "Inspiration" : "Advice"} title={initialCat === "Community" ? "Community & Foundation" : "News & Updates"} subtitle={initialCat === "Community" ? "How Peacock Paints supports the arts, sport and the communities around us." : "Product news, colour tips and community work from Peacock Paints."}'],
    ['        {sample && <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>', '        {items.length === 0 && <p style={{ fontSize: 15, color: "#777", margin: "10px 0 30px" }}>Nothing has been posted in this category yet. Please check back soon.</p>}\n        {sample && items.length > 0 && <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>'],
  ],
  "src/pages/PageSwitch.jsx": [
    ['<NewsPage />', '<NewsPage key="news" />'],
    ['      ) : pg === "projects" ? (', '      ) : pg === "community" ? (\n        <NewsPage key="community" initialCat="Community" />\n      ) : pg === "projects" ? ('],
  ],
  "src/data/navData.js": [
    ['{ title: "Real projects", links: [{ label: "Our Projects", page: "projects" }] },', '{ title: "Real projects", links: [{ label: "Our Projects", page: "projects" }, { label: "Community & Foundation", page: "community" }] },'],
    ['if (pg.endsWith("-inspiration") || pg.endsWith("-style")) return "inspiration";', 'if (pg.endsWith("-inspiration") || pg.endsWith("-style") || pg === "community") return "inspiration";'],
  ],
  "src/components/layout/Footer.jsx": [
    ['{page("projects", "Our projects")}', '{page("projects", "Our projects")}{page("community", "Community & Foundation")}'],
  ],
};
const problems = [], notes = [], contents = {};
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
for (const f of Object.keys(EDITS)) { if (!fs.existsSync(f)) problems.push("Missing " + f); else contents[f] = read(f); }
if (contents["src/data/updates.js"] && contents["src/data/updates.js"].includes('"Community"')) problems.push("Community is already installed");
if (!fs.existsSync("src/pages/PrivacyPage.jsx")) problems.push("Run add-site-links.mjs first");
for (const [f, list] of Object.entries(EDITS)) {
  if (!contents[f]) continue;
  for (const [find, rep] of list) {
    const n = contents[f].split(find).length - 1;
    if (n !== 1) problems.push(f + ": expected 1 match, found " + n + " for: " + find.slice(0, 70)); else contents[f] = contents[f].replace(find, () => rep);
  }
}
try {
  const esbuild = createRequire(import.meta.url)("esbuild");
  for (const [n, c] of Object.entries(contents)) { try { esbuild.transformSync(c, { loader: "jsx" }); } catch (e) { problems.push("Syntax problem in " + n + ": " + String(e.message).split("\n")[0]); } }
} catch { notes.push("esbuild not found, so no syntax check here; run npx eslint src afterwards"); }

if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }
for (const [f, c] of Object.entries(contents)) fs.writeFileSync(f, c);
console.log("\nDone. News & updates has a Community category, and #/community shows only those posts. It is in the Inspiration menu and the footer.");
notes.forEach(n => console.log("Note: " + n));
console.log("\nNext:\n  1. npx eslint src\n  2. Run 05-peacock-community.sql in the Supabase SQL Editor\n  3. npm run dev, add a post in #/dashboard -> News & updates with category Community, then open #/community\nUndo anytime with:  git checkout . ; git clean -fd src");
