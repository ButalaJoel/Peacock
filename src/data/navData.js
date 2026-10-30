import { B } from "./theme.js";

export const navData = [
  { label: "Colours", columns: [
    { title: "By Colours", links: ["Whites","Creams","Neutrals","Pinks","Yellows","Greens","Blues","Greys","Metallics"], footer: [{ label: "Shop all colours" }] },
    { title: "By Room", links: ["Bedroom","Living Room","Dining Room","Kitchen","Bathroom","Outdoor"] },
    { title: "By Style", links: ["Contemporary","Modern","Boho","Farmhouse","Scandi","Eclectic"] },
    { type: "promo", items: [{ title: "INSPIRATION GALLERY", desc: "Amazing room makeover ideas", cta: "Get inspired", bg: "#e8d5c4" },{ title: "ADVICE AND TIPS", desc: "Preparation & colour advice", cta: "Get Advice", bg: "#d4e0c8" }]}
  ]},
  { label: "Paints", columns: [
    { title: "Decorative", links: ["Interior Paints","Exterior Paints","Primers"], footer: [{ label: "All decorative paints" }] },
    { title: "Industrial", links: ["General Coatings","Waterproofing & Construction"], footer: [{ label: "All industrial coatings" }] },
    { title: "Wood Care & Solvents", links: ["Wood Care Paints","Thinners & Solvents"] },
    { type: "promo", items: [{ title: "COLOUR COLLECTION", desc: "Over 2,000 shades", cta: "Discover", bg: "#c8d8e8" }]}
  ]},
  { label: "Inspiration", columns: [
    { title: "By Colours", links: ["Whites","Creams","Neutrals","Pinks","Greens","Blues","Greys"], footer: [{ label: "Get inspired" }] },
    { title: "By Room", links: ["Bedroom","Living Room","Dining Room","Kitchen","Bathroom"] },
    { title: "By Style", links: ["Contemporary","Modern","Boho","Farmhouse","Scandi","Eclectic"] },
    { type: "promo", items: [{ title: "GREEN HUES", desc: "Versatile greens", cta: "Browse", bg: "#c4d8c0" },{ title: "KITCHENS", desc: "Kitchen makeover ideas", cta: "Inspo", bg: "#2d4a3e", dark: true }]}
  ]},
  { label: "Advice", columns: [
    { title: "Decorating Advice", links: ["How To Tips","Supplies & Primers","Colour Chart"] },
    { title: "Product Data", links: ["Safety Data Sheets","Technical Data Sheets"] },
    { type: "promo", items: [{ title: "FAQs", desc: "Common questions answered", cta: "View", bg: "#e0d4c8" },{ title: "ASK AN EXPERT", desc: "Talk to our team", cta: "Help", bg: "#c8d0d8" }]}
  ]},
  { label: "Our Story", columns: [
    { type: "promo", items: [{ title: "ABOUT US", desc: "Since 1962", cta: "Learn more", bg: B.coral, dark: true, page: "about" },{ title: "SUSTAINABILITY", desc: "Net Zero 2050", cta: "Read more", bg: B.teal, dark: true, page: "sustainability" }]},
    { type: "promo", items: [{ title: "COMMUNITY", desc: "Colour for all", cta: "Discover", bg: B.gold, page: "community" },{ title: "FOUNDATION", desc: "Brighter futures", cta: "Read", bg: "#5C2D6D", dark: true, page: "foundation" }]}
  ]},
  { label: "Professionals", columns: [
    { title: "Resources", links: ["Architects & Designers","Contractors & Decorators"] },
    { title: "Products", links: ["Decorative Paints","Industrial Coatings","Wood Care Paints","Thinners & Solvents"] },
    { title: "Colour", links: ["Find a Colour","Samples","Fandeck","Colour Services"] },
    { title: "Sectors", links: ["Office","Healthcare","Education","Housing","Hospitality","Infrastructure"] }
  ]},
];
