// One model photo for the home page: the one painting while standing (hero-1). Put it in src/assets/hero/.
// Every slide uses this same photo. Until it exists, the built-in room pictures are used.
const found = import.meta.glob("../assets/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", { eager: true, import: "default" });
const keys = Object.keys(found).sort();
const keep = keys.find(k => /hero-1\./i.test(k)) || keys[0];
export const HERO_PHOTOS = keep ? [found[keep]] : [];
export const heroPhoto = (i, fallback) => HERO_PHOTOS[0] || fallback;
