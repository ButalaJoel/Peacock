// Products the paint estimator can calculate, with coverage taken from the catalogue (CATALOGUE_2026.pdf).
// perLitre: [fewest, most] square metres covered by one litre, exactly as printed in the catalogue.
// The page also shows the catalogue's own coverage text (product.coverage) next to every result.
// Products that are not listed here (kilogram-based, no coverage given, or unclear) are not estimated:
// the estimator tells the visitor to ask our sales team instead of guessing.
//
// kit: for two-part products sold as one kit. coverage = [fewest, most] square metres per kit.
// variants: the catalogue gives different figures for different surfaces or film thicknesses.
// needsReview: the figure is under technical review, so the estimator shows no numbers yet.
export const ESTIMATOR_PRODUCTS = {
  // Decorative
  "vinyl-silk-makula": { perLitre: [10, 12] },
  "weathershield-plus": { perLitre: [12, 12] },
  "premium-matt": { perLitre: [10, 10] },
  "super-matt-emulsion": { perLitre: [8, 10] },
  "gloss-emulsion": { perLitre: [10, 12] },
  "standard-emulsion": { perLitre: [3, 3.75], note: "Catalogue: 4L covers 12-15 Sqm." },
  "undercoat-emulsion": { perLitre: [2, 3], note: "Catalogue figure is for fresh smooth wall screed plaster." },
  "flat-emulsion": { variants: [
    { label: "Fresh smooth wall screed plaster", perLitre: [2, 3] },
    { label: "Roughcast", perLitre: [1, 1.5] },
  ] },
  "floxy-tile-coating": { perLitre: [4, 4], note: "Catalogue figure is for 1 coat." },
  "latex-primer-sealer": { perLitre: [8, 9], note: "Catalogue: 4L covers 32-36 Sqm." },
  "plaster-primer": { perLitre: [3.6, 3.6], note: "Catalogue figure is for fresh smooth plaster." },
  "acrylic-elastomeric-coating": { perLitre: [4, 4] },
  "pearl-coat": { perLitre: [5, 6], note: "The catalogue says variations should be expected." },
  "acrylic-art-pallet": { perLitre: [4.6, 4.6] },
  "glaze-coat": { perLitre: [4.6, 4.6] },

  // Industrial
  "fast-dry-enamel": { perLitre: [8, 8] },
  "cellulose-enamel": { perLitre: [7, 7] },
  "epoxy-2k-enamel": { kit: { size: "Base 3L + Hardener 1L", coverage: [32, 40] }, note: "Catalogue: 4L covers 32-40 Sqm, depending on the surface." },
  "floxy-multipurpose-sealer": { perLitre: [6, 6] },
  "floxy-st-primer": { perLitre: [6, 6], note: "Catalogue figure is at 0.2mm thickness and depends on the surface." },
  "floxy-high-temperature-resistant-coating": { variants: [
    { label: "125 micron film", perLitre: [5.6, 5.6] },
    { label: "250 micron film", perLitre: [2.8, 2.8] },
  ] },
  "road-marking-paint": { perLitre: [6, 6] },
  "super-gloss": { perLitre: [5, 6], note: "Catalogue: 4L covers 20-24 Sqm." },
  "standard-hi-gloss": { perLitre: [2.5, 3], note: "Catalogue: 4L covers 10-12 Sqm." },
  "rd-enamel": { perLitre: [9, 10] },
  "undercoat-oil": { perLitre: [5, 5] },
  "concrete-sealer": { perLitre: [6.5, 6.5] },
  "bituminous-emulsion": { perLitre: [2, 3], note: "Depends on the texture of the surface." },
  "m-basecoat-aluminium": { perLitre: [8, 8] },
  // Under technical review: the catalogue (1L covers 4 Sqm) differs from the earlier prototype (3L kit covers 4 Sqm).
  "epoxy-self-levelling": { perLitre: [4, 4], needsReview: true },

  // Wood care
  "nc-sanding-sealer": { perLitre: [4, 6] },
  "premium-lacquer": { perLitre: [6, 10] },
  "clear-varnish": { perLitre: [7, 7.5], note: "Catalogue: 4L covers 28-30 Sqm." },
  "1k-polyurethane-varnish": { perLitre: [7, 7.5], note: "Catalogue: 4L covers 28-30 Sqm." },
};
