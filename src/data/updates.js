// News & updates shown on the home page slider and the News & Updates page.
// SAMPLE CONTENT: the team replaces these with its own items (later, from the dashboard).
// Only facts from the catalogue and the site itself are used. No prices.
// Each item can have these optional extras:
//   image: "/news/cover.jpg"   imageAlt: "..."   pdf: "/news/newsletter.pdf"   gallery: [{ src: "/news/a.jpg", alt: "..." }]
// Files go in public/news/. See public/news/HOW-TO-ADD-NEWS.txt.
export const UPDATE_CATEGORIES = ["Product news", "Colour tips", "Company", "Newsletter"];

export const UPDATES = [
  {
    id: "made-in-uganda", cat: "Company", date: "2026-11-02",
    title: "Made in Uganda since 1988",
    summary: "Peacock Paints is produced in our own factory in Kampala.",
    body: ["Peacock Paints has been made in Uganda since 1988, from our factory in Kampala's Industrial Area.", "Our team can help with colour selection, surface preparation and on-site technical guidance."],
    cta: "Talk to our team", page: "contact", tone: "#5C2D6D",
  },
  {
    id: "quote-any-product", cat: "Product news", date: "2026-11-02",
    title: "Request a quote for any product",
    summary: "Build your list and send it to our sales desk by WhatsApp or email.",
    body: ["Browse the range, add the products you need to your list and send it to us on WhatsApp or by email. Our sales desk replies with your quotation.", "No payment is taken on the website."],
    cta: "Browse products", page: "decorative-paints", tone: "#c0512f",
  },
  {
    id: "estimator", cat: "Product news", date: "2026-10-28",
    title: "Paint estimator: how much do you need?",
    summary: "Work out the quantity for your job before you ask for a quote.",
    body: ["Our estimator helps you work out roughly how much product a job needs, so your quote request is right first time.", "Coverage depends on the surface and the number of coats. Check the product page for details."],
    cta: "Try the estimator", page: "estimator", tone: "#1a3a5c",
  },
  {
    id: "colour-from-photo", cat: "Colour tips", date: "2026-10-28",
    title: "Find a colour from a photo",
    summary: "Spotted a colour you love? Upload a photo and we find the closest Peacock colours.",
    body: ["Upload a photo, drag the magnifier over it and we show the closest Peacock colours.", "Screens and cameras change how a colour looks, so order a sample to see the real colour in your own light."],
    cta: "Try the colour picker", page: "colour-picker", tone: "#2d4a3e",
  },
  {
    id: "test-in-your-light", cat: "Colour tips", date: "2026-10-20",
    title: "Test a colour in your own light",
    summary: "The same colour looks different in morning light, evening light and under bulbs.",
    body: ["Before you commit, look at a sample on the wall at different times of day. Daylight, lamps and neighbouring colours all change what you see.", "You can add colour samples to your request."],
    cta: "Browse colours", page: "all-colours", tone: "#b4604a",
  },
  {
    id: "prepare-surface", cat: "Colour tips", date: "2026-10-12",
    title: "Prepare the surface first",
    summary: "A good finish starts with a clean, sound, dry surface.",
    body: ["Each product page has a surface checklist so you know what to do before you start. Follow the product data sheet for the full method."],
    cta: "See our products", page: "decorative-paints", tone: "#3f5a7a",
  },
];
