// Runs after `vite build` and `vite build --ssr`. Writes a real HTML file for every public page into dist/, with the
// page text, title, description, canonical URL, share tags and structured data already inside, plus sitemap.xml and
// robots.txt. The staff dashboard is never prerendered. No headless browser is used.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SUPABASE_URL, SUPABASE_KEY } from "../src/config/supabase.js";

const DIST = "dist";
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const ssr = await import(pathToFileURL(path.resolve(".ssr/entry-server.js")).href);

// 1. Content that lives in Supabase (published rows only; the public anon key can read nothing else).
async function rows(table, query) {
  try {
    const r = await fetch(SUPABASE_URL + "/rest/v1/" + table + "?" + query, { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.json();
  } catch (e) { console.warn("  ! could not read " + table + " at build time (" + (e.cause?.code || e.message) + "); that page ships without it and fills in in the browser"); return null; }
}
const data = {};
for (const [key, table, q] of [
  ["projects", "projects", "select=*&status=eq.published&order=sort_order.asc,year.desc,created_at.desc"],
  ["news", "news_items", "select=*&status=eq.published&order=news_date.desc"],
  ["reviews", "reviews", "select=id,display_name,rating,body,product,place,created_at&published=eq.true&order=created_at.desc&limit=200"],
  ["awards", "awards", "select=*&published=eq.true&order=sort_order.asc,created_at.asc"],
]) { const r = await rows(table, q); if (Array.isArray(r)) data[key] = r; }
globalThis.__PP_DATA__ = data;
const dataTag = "<script>window.__PP_DATA__=" + JSON.stringify(data).replace(/</g, "\\u003c") + "</script>";

// 2. Build one HTML file per public page.
const page = (meta, body, withData) => template
  .replace(/<title>[\s\S]*?<\/title>/, "")
  .replace("</head>", "    " + ssr.headHtml(meta) + (withData ? "\n    " + dataTag : "") + "\n  </head>")
  .replace('<div id="root"></div>', '<div id="root">' + body + "</div>");

const paths = ssr.publicPaths();
let failed = 0;
for (const p of paths) {
  try {
    const html = page(ssr.getRouteMeta(p), ssr.render(p), true);
    const file = p === "/" ? path.join(DIST, "index.html") : path.join(DIST, p.slice(1), "index.html");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
  } catch (e) { failed++; console.error("  x " + p + ": " + e.message); }
}
if (failed) { console.error(failed + " page(s) failed to prerender."); process.exit(1); }

// 3. Fallback shell for everything that is not prerendered (the staff dashboard, unknown addresses): empty root, noindex.
fs.writeFileSync(path.join(DIST, "200.html"), page(ssr.getRouteMeta("/dashboard"), "", false));

// 4. Sitemap and robots.
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  paths.map(p => "  <url><loc>" + ssr.SITE + (p === "/" ? "/" : p) + "</loc><lastmod>" + today + "</lastmod></url>").join("\n") + "\n</urlset>\n");
const bots = ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot", "Claude-User", "Applebot", "DuckDuckBot"];
fs.writeFileSync(path.join(DIST, "robots.txt"),
  bots.map(b => "User-agent: " + b + "\nAllow: /\nDisallow: /dashboard\n").join("\n") +
  "\nUser-agent: *\nAllow: /\nDisallow: /dashboard\n\nSitemap: " + ssr.SITE + "/sitemap.xml\n");
console.log("Prerendered " + paths.length + " pages, sitemap.xml and robots.txt.");
