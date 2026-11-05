// Navigation: every link points to a page that exists.
// link = { label, page }          opens a page
//        { label, action: "quote" }  opens the quote form
// Colour family links ("Whites", "Blues"...) and style links ("Modern"...) find their page from the colour data.
import { COLOUR_CATEGORIES, STYLE_CATEGORIES, CAT_SWATCH_COLORS } from "./colours.js";

export const NAV = [
  {
    id: "story", label: "Our Story",
    groups: [
      { title: "Company", links: [
        { label: "About Us", page: "about" },
        { label: "Vision, Mission and Values", page: "vision" },
        { label: "Why Peacock Paints", page: "why-peacock" },
        { label: "Contact Us", page: "contact" },
      ] },
    ],
    cards: [
      { title: "ABOUT US", desc: "Proudly made in Uganda since 1988", cta: "Learn more", page: "about", bg: "#E8603C", dark: true },
      { title: "WHY PEACOCK PAINTS", desc: "Protect. Preserve. Prolong.", cta: "Read more", page: "why-peacock", bg: "#2BB5A0", dark: true },
    ],
  },
  {
    id: "products", label: "Products",
    groups: [
      { title: "Decorative", links: [
        { label: "Interior Paints", page: "decorative-paints-interior" },
        { label: "Exterior Paints", page: "decorative-paints-exterior" },
        { label: "Primers", page: "decorative-paints-primers" },
        { label: "Thinners & Solvents", page: "thinners-solvents" },
      ], footer: { label: "All decorative paints", page: "decorative-paints" } },
      { title: "Industrial / Protective", links: [
        { label: "General Coatings", page: "industrial-coatings-general" },
        { label: "Waterproofing & Construction", page: "industrial-coatings-waterproofing" },
        { label: "Thinners & Solvents", page: "thinners-solvents" },
      ], footer: { label: "All industrial / protective coatings", page: "industrial-coatings" } },
      { title: "Wood care and solvents", links: [
        { label: "Wood Care Paints", page: "wood-care-paints" },
        { label: "Thinners & Solvents", page: "thinners-solvents" },
      ] },
    ],
    cards: [
      { title: "PAINT ESTIMATOR", desc: "Work out how much you need", cta: "Try it", page: "estimator", bg: "#c8d8e8" },
      { title: "REQUEST A QUOTE", desc: "Tell us what you need", cta: "Get a quote", action: "quote", bg: "#e8dcc8" },
    ],
  },
  {
    id: "colours", label: "Colours",
    groups: [
      { title: "By colour", type: "families", footer: { label: "Shop all colours", page: "all-colours" } },
      { title: "Colour tools", links: [{ label: "Find a colour from a photo", page: "colour-picker" }, { label: "Our colour systems", page: "colour-systems" }] },
    ],
    cards: [
      { title: "ALL COLOURS", desc: "Browse the Peacock colour guide", cta: "Shop colours", page: "all-colours", bg: "#e8d5c4" },
      { title: "COLOUR PICKER", desc: "Upload a photo and find the closest colour", cta: "Try it", page: "colour-picker", bg: "#d4e0c8" },
    ],
  },
  {
    id: "inspiration", label: "Inspiration",
    groups: [
      { title: "By room", links: [
        { label: "Bedroom", page: "bedroom-inspiration" },
        { label: "Living Room", page: "livingroom-inspiration" },
        { label: "Dining Room", page: "diningroom-inspiration" },
        { label: "Kitchen", page: "kitchen-inspiration" },
        { label: "Bathroom", page: "bathroom-inspiration" },
      ] },
      { title: "By style", links: ["Contemporary", "Modern", "Boho", "Farmhouse", "Scandi", "Eclectic"].map(label => ({ label })) },
      { title: "Real projects", links: [{ label: "Our Projects", page: "projects" }] },
    ],
    cards: [
      { title: "GREEN HUES", desc: "Versatile greens", cta: "Browse", page: "greens-colour", bg: "#c4d8c0" },
      { title: "KITCHENS", desc: "Kitchen makeover ideas", cta: "Get inspired", page: "kitchen-inspiration", bg: "#2d4a3e", dark: true },
    ],
  },
  {
    id: "advice", label: "Advice",
    groups: [
      { title: "Help and advice", links: [
        { label: "Paint Estimator", page: "estimator" },
        { label: "News & Updates", page: "news" },
        { label: "Ask an expert", page: "contact" },
        { label: "Complaints & feedback", page: "feedback" },
        { label: "Request a quote", action: "quote" },
      ] },
    ],
    cards: [
      { title: "ASK AN EXPERT", desc: "Talk to our team", cta: "Contact us", page: "contact", bg: "#c8d0d8" },
    ],
  },
  {
    id: "professionals", label: "Professionals",
    groups: [
      { title: "For professionals", links: [
        { label: "Professionals overview", page: "professionals" },
        { label: "Our Projects", page: "projects" },
        { label: "Become a Distributor", page: "distributor" },
        { label: "Colour systems", page: "colour-systems" },
        { label: "Request a quote", action: "quote" },
      ] },
    ],
    cards: [
      { title: "BECOME A DISTRIBUTOR", desc: "Grow with Peacock Paints", cta: "Apply", page: "distributor", bg: "#5C2D6D", dark: true },
      { title: "TECHNICAL SUPPORT", desc: "From colour selection to site guidance", cta: "Contact us", page: "contact", bg: "#e0d4c8" },
    ],
  },
];

// The page a link opens.
export function resolvePage(link) {
  if (link.page) return link.page;
  if (COLOUR_CATEGORIES[link.label]) return COLOUR_CATEGORIES[link.label].slug;
  if (STYLE_CATEGORIES[link.label]) return STYLE_CATEGORIES[link.label].slug;
  return "home";
}

// The colour families shown with a coloured dot.
export function familyLinks() {
  return Object.keys(COLOUR_CATEGORIES).map(name => ({
    label: name,
    page: COLOUR_CATEGORIES[name].slug,
    count: COLOUR_CATEGORIES[name].colors.length,
    color: CAT_SWATCH_COLORS[name] || "#ddd",
  }));
}

// Which top menu a page belongs to, so the right menu stays highlighted.
export function menuForPage(pg) {
  if (["about", "vision", "why-peacock", "contact"].includes(pg)) return "story";
  if (pg === "product" || pg.startsWith("decorative-paints") || pg.startsWith("industrial-coatings") || pg === "wood-care-paints" || pg === "thinners-solvents") return "products";
  if (pg === "all-colours" || pg === "colour-detail" || pg === "colour-picker" || pg === "colour-systems" || pg.endsWith("-colour")) return "colours";
  if (pg.endsWith("-inspiration") || pg.endsWith("-style")) return "inspiration";
  if (pg === "estimator" || pg === "news" || pg === "feedback") return "advice";
  if (pg === "professionals" || pg === "distributor" || pg === "projects") return "professionals";
  return null;
}
