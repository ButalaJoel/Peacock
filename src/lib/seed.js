// Content fetched at build time (projects, news, reviews, awards) and written into each prerendered page as
// window.__PP_DATA__, so search engines see it and the first browser render matches the prerendered HTML.
// The browser still refreshes it from the database, so new posts appear without a redeploy.
export const seedFor = key => {
  const d = typeof globalThis !== "undefined" ? globalThis.__PP_DATA__ : null;
  return d && Array.isArray(d[key]) ? d[key] : null;
};
