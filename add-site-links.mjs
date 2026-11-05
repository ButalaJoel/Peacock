// Links to the new pages, plus a privacy notice page.
// - Menu: "Complaints & feedback" under Advice. Thinners & Solvents is also linked under Decorative and Industrial (it stays one category).
// - Menu: the Industrial heading becomes "Industrial / Protective" (skipped if already changed).
// - Footer: "Complaints & feedback" and "Privacy notice" under Company.
// - New page  #/privacy  (privacy notice).
// Run from the project root AFTER add-forms.mjs:  node add-site-links.mjs
// NEW: src/pages/PrivacyPage.jsx
// EDITS: src/data/navData.js, src/components/layout/Footer.jsx, src/pages/PageSwitch.jsx
// Undo: git checkout . ; git clean -fd src
import fs from "node:fs";
import { createRequire } from "node:module";

const PRIVACY = "import { CONTACT } from \"../config/contact.js\";\nimport PageHero from \"../components/common/PageHero.jsx\";\n\nconst SECTIONS = [\n  [\"Who we are\", [CONTACT.companyName + \" (\\\"Peacock Paints\\\", \\\"we\\\") is a paint manufacturer in Uganda. This notice explains what personal information this website collects, why, and what your rights are. It applies to \" + CONTACT.website + \".\"]],\n  [\"What we collect, and when\", [\n    \"Newsletter: your email address when you subscribe.\",\n    \"Quote requests: the name, phone number, email address and the products and colours you choose when you ask for a quote.\",\n    \"Contact messages: your name, phone number, email address and what you write to us.\",\n    \"Distributor and dealer applications: your name, phone, email, business name, shop location, four photos of your shop, years in business, registration and tax (TIN) status, and the name, phone number and relationship of a next of kin.\",\n    \"Complaints and feedback: your name, phone or email, the product, where you bought it, and your message and rating.\",\n    \"WhatsApp and email: when you use the WhatsApp or email buttons, the message is sent from your own app, so WhatsApp or your email provider handles it under their own terms.\",\n  ]],\n  [\"Why we use it\", [\n    \"To reply to you, prepare quotes, handle complaints and feedback, send the newsletter you asked for, and assess applications to become a distributor or dealer.\",\n    \"To make sure no request is missed, our team receives an internal alert when a new request arrives. We may send you an automatic acknowledgement.\",\n    \"We do not sell your information, and we do not use it for anything unrelated to the reasons above.\",\n  ]],\n  [\"Who can see it\", [\n    \"Only authorised Peacock Paints staff with a login can see requests, applications and photos. Shop photos are kept in private storage.\",\n    \"Our website and database are provided by trusted technology suppliers who store data on our behalf on secure cloud servers, which may be outside Uganda. They may only use it to run the service for us.\",\n  ]],\n  [\"How long we keep it\", [\"We keep personal information only as long as we need it for the reasons above or as the law requires, and then delete or anonymise it. You can ask us to delete your information sooner (see below).\"]],\n  [\"Your rights\", [\n    \"You can ask to see the personal information we hold about you, correct it, or delete it, and you can unsubscribe from the newsletter at any time.\",\n    \"If you give us details about another person, such as a next of kin, please make sure they know and are happy for you to do so.\",\n    \"You may also complain to the Personal Data Protection Office in Uganda if you believe your information has been handled unlawfully.\",\n  ]],\n  [\"Contact us\", [\"To use any of these rights or ask a question, email \" + CONTACT.salesEmail + \" or call \" + CONTACT.phones.join(\" / \") + \". Please quote your reference number if you have one.\"]],\n];\n\nexport default function PrivacyPage() {\n  return (\n    <div>\n      <PageHero kicker=\"Your information\" title=\"Privacy notice\" subtitle=\"How Peacock Paints looks after the information you give us on this website.\" gradient=\"linear-gradient(135deg, #1F6F78, #2A9AA5)\" />\n      <section style={{ maxWidth: 780, margin: \"0 auto\", padding: \"44px 24px 70px\" }}>\n        {SECTIONS.map(([title, items]) => (\n          <div key={title} style={{ marginBottom: 30 }}>\n            <h2 style={{ fontSize: 22, marginBottom: 10 }}>{title}</h2>\n            {items.length === 1\n              ? <p style={{ fontSize: 15, color: \"#444\", lineHeight: 1.8 }}>{items[0]}</p>\n              : <ul style={{ paddingLeft: 20, margin: 0 }}>{items.map(t => <li key={t} style={{ fontSize: 15, color: \"#444\", lineHeight: 1.8, marginBottom: 6 }}>{t}</li>)}</ul>}\n          </div>\n        ))}\n      </section>\n    </div>\n  );\n}\n";
const problems = [], notes = [], contents = {};
const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const EDITS = {
  "src/data/navData.js": [
    ['        { label: "Ask an expert", page: "contact" },', '        { label: "Ask an expert", page: "contact" },\n        { label: "Complaints & feedback", page: "feedback" },'],
    ['        { label: "Primers", page: "decorative-paints-primers" },', '        { label: "Primers", page: "decorative-paints-primers" },\n        { label: "Thinners & Solvents", page: "thinners-solvents" },'],
    ['        { label: "Waterproofing & Construction", page: "industrial-coatings-waterproofing" },', '        { label: "Waterproofing & Construction", page: "industrial-coatings-waterproofing" },\n        { label: "Thinners & Solvents", page: "thinners-solvents" },'],
    ['if (pg === "estimator" || pg === "news") return "advice";', 'if (pg === "estimator" || pg === "news" || pg === "feedback") return "advice";'],
    ['{ title: "Industrial", links', '{ title: "Industrial / Protective", links', true],
    ['label: "All industrial coatings"', 'label: "All industrial / protective coatings"', true],
  ],
  "src/components/layout/Footer.jsx": [
    ['{page("distributor", "Become a Distributor")}</div>', '{page("distributor", "Become a Distributor")}{page("feedback", "Complaints & feedback")}{page("privacy", "Privacy notice")}</div>'],
  ],
  "src/pages/PageSwitch.jsx": [
    ['      ) : pg === "projects" ? (', '      ) : pg === "privacy" ? (\n        <PrivacyPage />\n      ) : pg === "projects" ? ('],
  ],
};
for (const f of Object.keys(EDITS)) { if (!fs.existsSync(f)) problems.push("Missing " + f); else contents[f] = read(f); }
if (!fs.existsSync("src/pages/FeedbackPage.jsx")) problems.push("Run add-forms.mjs first (src/pages/FeedbackPage.jsx is missing)");
if (fs.existsSync("src/pages/PrivacyPage.jsx")) problems.push("The privacy page is already installed");
for (const [f, list] of Object.entries(EDITS)) {
  if (!contents[f]) continue;
  for (const [find, rep, optional] of list) {
    const n = contents[f].split(find).length - 1;
    if (n === 1) contents[f] = contents[f].replace(find, () => rep);
    else if (optional && n === 0) notes.push(f + ": skipped (already changed): " + find.slice(0, 50));
    else problems.push(f + ": expected 1 match, found " + n + " for: " + find.slice(0, 70));
  }
}
if (contents["src/pages/PageSwitch.jsx"]) contents["src/pages/PageSwitch.jsx"] = 'import PrivacyPage from "./PrivacyPage.jsx";\n' + contents["src/pages/PageSwitch.jsx"];
try {
  const esbuild = createRequire(import.meta.url)("esbuild");
  const check = (n, c) => { try { esbuild.transformSync(c, { loader: "jsx" }); } catch (e) { problems.push("Syntax problem in " + n + ": " + String(e.message).split("\n")[0]); } };
  check("PrivacyPage.jsx", PRIVACY);
  for (const [n, c] of Object.entries(contents)) check(n, c);
} catch { notes.push("esbuild not found, so no syntax check here; run npx eslint src afterwards"); }

if (problems.length) { console.log("\nNothing was changed. Problems:"); problems.forEach(p => console.log("  - " + p)); process.exit(1); }
fs.writeFileSync("src/pages/PrivacyPage.jsx", PRIVACY);
for (const [f, c] of Object.entries(contents)) fs.writeFileSync(f, c);
console.log("\nDone. The menu and footer now link to Complaints & feedback, and #/privacy exists.");
notes.forEach(n => console.log("Note: " + n));
console.log("\nNext:\n  1. npx eslint src\n  2. npm run dev and open the menu (Advice), the footer and #/privacy\nUndo anytime with:  git checkout . ; git clean -fd src");
