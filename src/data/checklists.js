// "Before you start" content for the product pages.
// Everything here comes from the Peacock Paints catalogue (surface preparation and primer guides).
// Where the catalogue says nothing about a product, the page tells the visitor to ask the sales team.
// Needs technical review before launch.

export const GENERAL_STEPS = [
  { label: "Sand", text: "Removes loose material such as dirt, dust and powder from the surface." },
  { label: "Scrape", text: "Removes flaky and loose material. Painting can never be done on top of flaky or loose paint." },
  { label: "Etch", text: "For very smooth surfaces such as iron sheets, metal plates and mortar floors. The etching material roughens the surface so the next coats can stick." },
  { label: "Repair masonry", text: "Some surfaces need masonry work: loose plaster may have to be redone with fresh plaster." },
  { label: "Treat dampness", text: "Moisture in the surface should be below 15%, checked with a moisture meter. Use the recommended sealers and primers, such as Concrete Sealer." },
  { label: "De-grease", text: "Special solvents remove grease and oily material that would stop later coats from sticking." },
];

export const PRIMER_GUIDE = [
  { surface: "Bare wood", primer: "Peacock SB Stain Sealer" },
  { surface: "Concrete or masonry", primer: "Peacock Alkali-resistant Primer or SB Stain Sealer" },
  { surface: "Metal", primer: "Rust-inhibiting Peacock Etch Primer" },
  { surface: "Drywall", primer: "Latex Primer Sealer" },
  { surface: "Glossy surfaces", primer: "Peacock WB Bond Aid" },
  { surface: "Previously painted, stable surfaces", primer: "Latex Primer Sealer (if the surface is in good condition)" },
  { surface: "Damp floors or difficult-to-prepare surfaces", primer: "Peacock Floxy ST Primer" },
];

export const WOOD_STEPS = [
  { label: "Inspect", text: "Check for dirt, grease, mildew, flaking paint, rot or loose fixtures." },
  { label: "Clean", text: "Use soap and water indoors, or wood cleaner or a bleach solution outdoors. Let it dry." },
  { label: "Remove old finishes", text: "Strip or sand flaking paint or varnish." },
  { label: "Sand", text: "Use medium to fine sandpaper, in the direction of the wood grain." },
  { label: "Repair", text: "Fill cracks or holes with interior or exterior grade wood filler. Sand smooth." },
  { label: "Prime if needed", text: "Use NC wood primer for bare wood, high-tannin wood, or when changing paint types." },
  { label: "Check conditions", text: "The wood must be dry (below 15% moisture). Avoid high humidity or direct sun." },
];

export const WOOD_TIPS = [
  { label: "Interior wood", text: "Use a low odour finish for a smooth result, with good ventilation." },
  { label: "Exterior wood", text: "Use urethane oil varnish. Seal joints and end grains, and recoat regularly." },
];

export const WOOD_FINAL = [
  { label: "Surface inspected and cleaned" },
  { label: "Old paint or varnish removed" },
  { label: "Surface sanded and dust-free" },
  { label: "Cracks and holes repaired" },
  { label: "Primer applied (if needed)" },
  { label: "Substrate dry" },
  { label: "Sanding sealer (1K or 2K) selected" },
  { label: "Correct paint or stain chosen" },
];

// Returns null when there is nothing in the catalogue for this product (for example thinners).
export function checklistFor(product) {
  if (product.category === "woodcare") {
    return {
      kind: "wood",
      intro: "Wood care paints work best on a clean, dry, sound surface. Tick each item off as you go.",
      steps: WOOD_STEPS,
      tips: WOOD_TIPS,
      tickItems: WOOD_FINAL,
      source: "Peacock Paints catalogue: Surface Preparation for Wood Care Paints",
    };
  }
  const paint = product.category === "decorative" || product.category === "industrial";
  if (paint && !product.subcategories.includes("other")) {
    return {
      kind: "general",
      intro: "A strong, stable surface comes first. Tick each step off as you go.",
      steps: null,
      tips: null,
      tickItems: GENERAL_STEPS,
      primers: PRIMER_GUIDE,
      damp: product.category === "industrial" && product.subcategories.includes("general"),
      source: "Peacock Paints catalogue: Surface Preparation Checklist and How to Choose a Primer",
    };
  }
  return null;
}
