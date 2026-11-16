// Adds basic security headers to the live site (Vercel reads vercel.json). Run from the project root:  node add-security-headers.mjs
// Undo: git checkout vercel.json   (or delete vercel.json if it was new)
import fs from "node:fs";
const HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];
let cfg = {};
if (fs.existsSync("vercel.json")) {
  try { cfg = JSON.parse(fs.readFileSync("vercel.json", "utf8")); } catch { console.log("\nNothing changed: vercel.json exists but is not valid JSON."); process.exit(1); }
}
if (JSON.stringify(cfg).includes("X-Content-Type-Options")) { console.log("\nNothing changed: this looks already applied."); process.exit(1); }
cfg.headers = (cfg.headers || []).concat([{ source: "/(.*)", headers: HEADERS }]);
fs.writeFileSync("vercel.json", JSON.stringify(cfg, null, 2) + "\n");
console.log("\nDone: vercel.json now sends " + HEADERS.length + " security headers.\nNext: commit and push. After Vercel redeploys, test at https://securityheaders.com with your live link.\nUndo anytime with:  git checkout vercel.json");
