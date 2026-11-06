// Photos for the home page slider. Put your photos in  src/assets/hero/  (JPG, PNG or WebP) and they appear in the slider
// in file-name order (hero-1.jpg, hero-2.jpg, hero-3.jpg...). Until a photo exists for a slide, the built-in room picture is used.
const found = import.meta.glob("../assets/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", { eager: true, import: "default" });
export const HERO_PHOTOS = Object.keys(found).sort().map(k => found[k]);
export const heroPhoto = (i, fallback) => HERO_PHOTOS[i] || fallback;
