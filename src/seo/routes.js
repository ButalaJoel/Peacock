// Everything search engines and AI crawlers read about each page: title, description, canonical URL, share tags
// and structured data (JSON-LD). Pure functions (no window), used at build time to prerender and in the browser
// to keep the tab title in step when someone clicks around.
import { CONTACT } from "../config/contact.js";
import { BUSINESS } from "../config/business.js";
import { PRODUCTS, CATEGORY_PAGES } from "../data/products.js";
import { CATEGORIES } from "../data/products.catalogue.js";
import { storyPages } from "../data/storyPages.js";
import { trendingColours, COLOUR_CATEGORIES, STYLE_CATEGORIES } from "../data/colours.js";
import { colourSlug } from "../routing.js";

export const SITE = "https://www.peacock.co.ug";
export const SITE_NAME = "Peacock Paints";
export const SHARE_IMAGE = SITE + "/og-image.png";
const clip = (s, n = 158) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…"; };

// Fixed pages: [path slug, title, description, indexable?]
const PAGES = {
  home: ["Peacock Paints Uganda | The Painters' Paint, made in Kampala since 1988", "Quality decorative paints, industrial coatings and wood care from Peacock Paints Limited, made in Kampala since 1988. Explore 150+ colours, order samples and request a quote."],
  "start-here": ["Where do I start? Choose the right paint | Peacock Paints", "Not sure which paint you need? Pick your surface and find the right Peacock Paints product, then request a quote."],
  estimator: ["Paint estimator: how much paint do I need? | Peacock Paints", "Work out how much paint you need for your room or project with the Peacock Paints estimator."],
  visualiser: ["Colour visualiser: try a colour on your room | Peacock Paints", "Upload a photo of your room and see a Peacock Paints colour on your walls. Your photo stays on your device."],
  "colour-picker": ["Colour picker: find a Peacock colour from a photo | Peacock Paints", "Upload a photo and find the closest matching Peacock Paints colours."],
  "colour-systems": ["Colour systems: Peacock, NCS, RAL, BS 4800 and NOVA | Peacock Paints", "Peacock Paints can match colours across the Peacock, NCS, RAL, BS 4800 and NOVA colour systems."],
  "all-colours": ["All colours: browse the Peacock Paints colour guide", "Browse more than 150 Peacock Paints colours and order a colour sample to test in your own light."],
  news: ["News and updates | Peacock Paints", "Product news, colour tips and company updates from Peacock Paints Limited, Kampala."],
  reviews: ["Customer reviews | Peacock Paints", "What customers say about Peacock Paints."],
  projects: ["Our projects: places painted with Peacock Paints", "Homes, businesses and industrial sites in Uganda finished with Peacock Paints."],
  professionals: ["Professionals: painters, architects and contractors | Peacock Paints", "Support for painters, architects, contractors and specifiers: colour selection, surface preparation and on-site guidance."],
  contact: ["Contact Peacock Paints, Industrial Area, Kampala", "Contact Peacock Paints Limited, Plot 56, Sixth Street, Industrial Area, Kampala. Call +256-414-231721 or +256-700-159368, or email sales@peacock.co.ug."],
  distributor: ["Become a Peacock Paints distributor", "Apply to become a Peacock Paints distributor or dealer in Uganda."],
  feedback: ["Feedback | Peacock Paints", "Tell Peacock Paints about your experience. Every message is read by our team."],
  privacy: ["Privacy notice | Peacock Paints", "How Peacock Paints looks after the information you give us on this website."],
  unsubscribe: ["Unsubscribe from the newsletter | Peacock Paints", "Ask to be removed from the Peacock Paints newsletter."],
  "get-a-quote": ["Request a quote | Peacock Paints", "Tell us the products and quantities you need and the Peacock Paints sales team will send you a quotation."],
  advice: ["Advice, tools and inspiration | Peacock Paints", "Paint estimator, colour visualiser, where to start and expert advice from Peacock Paints."],
};
const NOINDEX = new Set(["unsubscribe", "get-a-quote"]);
const ROOMS = { "bedroom-inspiration": "Bedroom", "livingroom-inspiration": "Living room", "diningroom-inspiration": "Dining room", "kitchen-inspiration": "Kitchen", "bathroom-inspiration": "Bathroom" };

function productMeta(p) {
  const cat = CATEGORIES[p.category];
  const bits = [p.desc];
  if (p.coverage) bits.push("Coverage " + p.coverage + ".");
  if (p.packSizes && p.packSizes.length) bits.push("Pack sizes " + p.packSizes.join(", ") + ".");
  return { title: p.name + " | " + (cat ? cat.label + " | " : "") + SITE_NAME, description: clip(bits.join(" ")) };
}

// Returns { path, title, description, noindex, jsonld[] } for any path, or the home page defaults for unknown ones.
export function getRouteMeta(pathname) {
  let p = String(pathname || "/"); try { p = decodeURIComponent(p); } catch { /* keep */ }
  p = p.replace(/^\/+|\/+$/g, "");
  const out = { path: p ? "/" + p : "/", title: PAGES.home[0], description: PAGES.home[1], noindex: false, jsonld: [] };
  const set = (t, d) => { out.title = t; out.description = clip(d); };
  if (!p || p === "home") { out.jsonld.push(orgSchema()); return out; }
  if (PAGES[p]) { set(PAGES[p][0], PAGES[p][1]); out.noindex = NOINDEX.has(p); }
  else if (storyPages[p]) set(storyPages[p].title + " | " + SITE_NAME, (storyPages[p].subtitle ? storyPages[p].subtitle + ". " : "") + String(storyPages[p].sections?.[0]?.c || ""));
  else if (CATEGORY_PAGES[p]) {
    const info = CATEGORY_PAGES[p], cat = CATEGORIES[info.category];
    const sub = info.sub ? cat.subcategories.find(s => s.id === info.sub) : null;
    const name = sub ? cat.label + ": " + sub.label : cat.label;
    set(name + " | " + SITE_NAME, (cat.tagline || "") + ". Browse the full Peacock Paints range of " + name.toLowerCase() + " and request a quote.");
  } else if (ROOMS[p]) set(ROOMS[p] + " paint colour ideas | " + SITE_NAME, "Colour ideas and real Peacock Paints shades for your " + ROOMS[p].toLowerCase() + ".");
  else if (p.startsWith("product/")) {
    const pr = PRODUCTS.find(x => x.id === p.slice(8));
    if (pr) { const m = productMeta(pr); set(m.title, m.description); out.jsonld.push(productSchema(pr)); }
  } else if (p.startsWith("colour/")) {
    const c = trendingColours.find(x => colourSlug(x) === p.slice(7));
    if (c) set(c.name + " paint colour | " + SITE_NAME, c.name + ": " + c.desc + ". A Peacock Paints colour, with matching shades and sample pots available.");
  } else {
    const cc = Object.entries(COLOUR_CATEGORIES).find(([, v]) => v.slug === p);
    const st = Object.entries(STYLE_CATEGORIES).find(([, v]) => v.slug === p);
    if (cc) set(cc[0] + " paint colours | " + SITE_NAME, cc[1].desc + ". Browse " + cc[0].toLowerCase() + " from the Peacock Paints colour guide.");
    else if (st) set(st[0] + " style colour palette | " + SITE_NAME, st[1].desc + ".");
    else out.noindex = true; // unknown path (for example the staff dashboard): never indexed
  }
  if (p === "dashboard") { out.noindex = true; out.title = "Staff sign in | " + SITE_NAME; out.description = "Peacock Paints staff area."; }
  return out;
}

// Every public page that should be prerendered and listed in the sitemap.
export function publicPaths() {
  const list = ["/"];
  for (const k of Object.keys(PAGES)) if (!NOINDEX.has(k)) list.push("/" + k);
  for (const k of Object.keys(storyPages)) list.push("/" + k);
  for (const k of Object.keys(CATEGORY_PAGES)) list.push("/" + k);
  for (const k of Object.keys(ROOMS)) list.push("/" + k);
  for (const v of Object.values(COLOUR_CATEGORIES)) list.push("/" + v.slug);
  for (const v of Object.values(STYLE_CATEGORIES)) list.push("/" + v.slug);
  for (const pr of PRODUCTS) list.push("/product/" + pr.id);
  for (const c of trendingColours) list.push("/colour/" + colourSlug(c));
  return [...new Set(list)];
}

// Pages that exist but are kept out of the sitemap (prerendered, noindex).
export const hiddenPaths = () => [...NOINDEX].map(k => "/" + k);
// Addresses served by the plain app shell (no prerendered content): the staff dashboard and pages that need a selection.
export const shellPaths = () => ["/dashboard", "/colour-detail", "/product", "/colour"];

function orgSchema() {
  const days = { "Monday to Friday": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], Saturday: ["Saturday"] };
  const to24 = t => { const m = /(\d+):(\d+)(am|pm)/i.exec(t); if (!m) return null; let h = +m[1] % 12; if (/pm/i.test(m[3])) h += 12; return String(h).padStart(2, "0") + ":" + m[2]; };
  const hours = BUSINESS.hours.filter(h => days[h.days]).map(h => { const [o, c] = h.time.split(" to "); return { "@type": "OpeningHoursSpecification", dayOfWeek: days[h.days], opens: to24(o), closes: to24(c) }; });
  return {
    "@context": "https://schema.org", "@type": ["LocalBusiness", "Organization"], "@id": SITE + "/#business",
    name: CONTACT.companyName, alternateName: SITE_NAME, url: SITE + "/", logo: SITE + "/logo.png", image: SHARE_IMAGE,
    description: "Paint manufacturer in Kampala, Uganda, making decorative paints, industrial coatings and wood care since 1988.",
    telephone: CONTACT.phones[0], email: CONTACT.salesEmail, foundingDate: "1988",
    address: { "@type": "PostalAddress", streetAddress: "Plot 56, Sixth Street, Industrial Area", postOfficeBoxNumber: "9549", addressLocality: "Kampala", addressCountry: "UG" },
    areaServed: { "@type": "Country", name: "Uganda" },
    contactPoint: CONTACT.phones.map(t => ({ "@type": "ContactPoint", telephone: t, contactType: "sales", areaServed: "UG", availableLanguage: "English" })),
    openingHoursSpecification: hours,
  };
}
// Product schema without prices: the site orders by quote, so there is no offer price to publish.
function productSchema(p) {
  const cat = CATEGORIES[p.category];
  return {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.desc,
    brand: { "@type": "Brand", name: SITE_NAME }, manufacturer: { "@id": SITE + "/#business" },
    category: cat ? cat.label : undefined, url: SITE + "/product/" + p.id,
    image: p.img ? [SITE + (String(p.img).startsWith("/") ? p.img : "/" + p.img)] : undefined,
  };
}

const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
// Builds the <head> tags as an HTML string (used by the prerender script).
export function headHtml(meta) {
  const url = SITE + (meta.path === "/" ? "/" : meta.path);
  const tags = [
    "<title>" + esc(meta.title) + "</title>",
    '<meta name="description" content="' + esc(meta.description) + '" />',
    '<link rel="canonical" href="' + esc(url) + '" />',
    meta.noindex ? '<meta name="robots" content="noindex, nofollow" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />',
    '<meta property="og:type" content="website" />', '<meta property="og:site_name" content="' + SITE_NAME + '" />',
    '<meta property="og:title" content="' + esc(meta.title) + '" />', '<meta property="og:description" content="' + esc(meta.description) + '" />',
    '<meta property="og:url" content="' + esc(url) + '" />', '<meta property="og:image" content="' + SHARE_IMAGE + '" />',
    '<meta property="og:image:width" content="1200" />', '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />', '<meta name="twitter:title" content="' + esc(meta.title) + '" />',
    '<meta name="twitter:description" content="' + esc(meta.description) + '" />', '<meta name="twitter:image" content="' + SHARE_IMAGE + '" />',
  ];
  for (const j of meta.jsonld) tags.push('<script type="application/ld+json">' + JSON.stringify(j).replace(/</g, "\\u003c") + "</script>");
  return tags.join("\n    ");
}

// Browser side: update the tab title, description, canonical and share tags after a client-side page change.
export function applyHead(meta) {
  if (typeof document === "undefined") return;
  document.title = meta.title;
  const url = SITE + (meta.path === "/" ? "/" : meta.path);
  const set = (sel, make, attr, val) => { let el = document.head.querySelector(sel); if (!el) { el = make(); document.head.appendChild(el); } el.setAttribute(attr, val); };
  const metaTag = (key, v, name) => set("meta[" + key + '="' + name + '"]', () => { const m = document.createElement("meta"); m.setAttribute(key, name); return m; }, "content", v);
  metaTag("name", meta.description, "description");
  metaTag("name", meta.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large", "robots");
  metaTag("property", meta.title, "og:title"); metaTag("property", meta.description, "og:description"); metaTag("property", url, "og:url");
  metaTag("name", meta.title, "twitter:title"); metaTag("name", meta.description, "twitter:description");
  set('link[rel="canonical"]', () => { const l = document.createElement("link"); l.rel = "canonical"; return l; }, "href", url);
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach(s => s.remove());
  for (const j of meta.jsonld) { const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(j); document.head.appendChild(s); }
}
