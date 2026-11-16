// "Where do I start?" guide: which Peacock paints for which surface. Product ids come from products.catalogue.js.
// Picks without CONFIRM were given by the sales team. Picks marked CONFIRM are suggestions: management must approve them.
export const GUIDE = [
  {
    id: "interior-walls",
    title: "Inside walls",
    intro: "Living rooms, bedrooms and offices.",
    picks: ["vinyl-silk-makula", "venetian-stucco", "pearl-coat"],
  },
  {
    id: "bathrooms",
    title: "Bathrooms",
    intro: "Rooms that see steam and splashes.",
    picks: ["premium-matt"],
  },
  {
    id: "exterior-walls",
    title: "Outside walls",
    intro: "Walls that face sun and rain.",
    picks: ["mastic-textured-paint", "weathershield-plus"],
  },
  {
    id: "floors",
    title: "Floors",
    intro: "Garages, workshops, shops and factory floors.",
    picks: ["epoxy-self-levelling", "epoxy-2k-enamel"], // CONFIRM: "2K" could also mean 2K Acrylic Polyurethane
  },
  {
    id: "ceilings",
    title: "Ceilings",
    intro: "Smooth, light ceilings.",
    picks: ["super-matt-emulsion"], // CONFIRM
  },
  {
    id: "wood",
    title: "Wood and joinery",
    intro: "Doors, furniture and window frames.",
    picks: ["clear-varnish", "premium-lacquer"], // CONFIRM
  },
  {
    id: "metal",
    title: "Metal",
    intro: "Gates, grills and roofing sheets.",
    picks: ["metal-primer", "fast-dry-enamel"], // CONFIRM
  },
];
