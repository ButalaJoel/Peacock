// Completed projects: places where Peacock Paints has been used.
// The two items below are SAMPLE LAYOUTS (sample: true). Replace them with real projects, and only list a project
// once the client agrees. See public/projects/HOW-TO-ADD-PROJECTS.txt.
// Optional fields: image, imageAlt, gallery: [{ src, alt }], products: ["product-id", ...] (ids from the catalogue), client.
export const PROJECT_TYPES = ["Residential", "Commercial", "Industrial", "Public & institutional"];

export const TYPE_TONES = {
  "Residential": "#c0512f",
  "Commercial": "#1a3a5c",
  "Industrial": "#2d4a3e",
  "Public & institutional": "#5C2D6D",
};

export const PROJECTS = [
  {
    id: "sample-residential", sample: true,
    name: "Project name goes here", location: "Kampala", type: "Residential", year: "2026",
    summary: "One or two lines about the project for the card.",
    body: ["Tell the story here: the surfaces, the colours chosen, the challenge and the result."],
    products: ["vinyl-silk-makula", "weathershield-plus"],
  },
  {
    id: "sample-industrial", sample: true,
    name: "Another project name", location: "Uganda", type: "Industrial", year: "2026",
    summary: "A short description of the job and the coatings used.",
    body: ["Add the details of the work here, with photos in the gallery."],
    products: [],
  },
];
