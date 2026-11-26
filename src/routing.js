// Real URL paths for every page (/products..., /product/<id>, /colour/<name>).
// Pure functions only (no window), so the same code runs in the browser and at build time for prerendering.
import { PRODUCTS } from "./data/products.js";
import { trendingColours, COLOUR_CATEGORIES } from "./data/colours.js";

export const slugify = s => String(s).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export const colourSlug = c => slugify(c.name);
export const findColourCat = name => { for (const [k, v] of Object.entries(COLOUR_CATEGORIES)) { if (v.colors.includes(name)) return k; } return null; };

export const pathForPage = slug => (!slug || slug === "home" ? "/" : "/" + slug);
export const pathForProduct = p => "/product/" + p.id;
export const pathForColour = c => "/colour/" + colourSlug(c);

// Turns a URL path into the page state the app uses.
export function resolveRoute(pathname) {
  let p = String(pathname || "/");
  try { p = decodeURIComponent(p); } catch { /* keep as is */ }
  p = p.replace(/^\/+|\/+$/g, "");
  if (!p || p === "home") return { pg: "home" };
  if (p.startsWith("product/")) {
    const product = PRODUCTS.find(x => x.id === p.slice(8));
    if (product) return { pg: "product", product };
  }
  if (p.startsWith("colour/")) {
    const s = p.slice(7);
    const colour = trendingColours.find(c => colourSlug(c) === s || c.name === s);
    if (colour) return { pg: "colour-detail", colour, colourCategory: findColourCat(colour.name) };
  }
  return { pg: p };
}
