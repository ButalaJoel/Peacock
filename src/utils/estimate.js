// Pure estimating functions (no React) so they can be tested on their own.

const round1 = n => Math.round(n * 10) / 10;

// "1L" -> 1, "4L" -> 4, "20L" -> 20, "½L" -> 0.5. Anything else (kg, kits) -> null.
export function packLitres(size) {
  const m = String(size).trim().match(/^(½|\d+(?:\.\d+)?)\s*L$/i);
  if (!m) return null;
  return m[1] === "½" ? 0.5 : Number(m[1]);
}

// Cheapest way to reach at least "needed" litres with the given pack sizes:
// least total litres first, then fewest packs. packs = [{ size, litres }]
export function chooseLitrePacks(needed, packs) {
  if (!(needed > 0) || packs.length === 0) return null;
  const unit = 0.5; // every catalogue pack is a multiple of half a litre
  const sizes = packs.map(p => ({ ...p, u: Math.round(p.litres / unit) }));
  const target = Math.ceil(needed / unit - 1e-9);
  const limit = target + Math.max(...sizes.map(s => s.u));
  const best = new Array(limit + 1).fill(Infinity);
  const from = new Array(limit + 1).fill(null);
  best[0] = 0;
  for (let i = 1; i <= limit; i++) {
    for (const s of sizes) {
      if (i >= s.u && best[i - s.u] + 1 < best[i]) { best[i] = best[i - s.u] + 1; from[i] = s; }
    }
  }
  let total = -1;
  for (let i = target; i <= limit; i++) if (best[i] < Infinity) { total = i; break; }
  if (total < 0) return null;
  const counts = {};
  for (let i = total; i > 0; i = i - from[i].u) counts[from[i].size] = (counts[from[i].size] || 0) + 1;
  const items = Object.entries(counts).map(([size, qty]) => ({ size, qty, litres: sizes.find(s => s.size === size).litres }))
    .sort((a, b) => b.litres - a.litres);
  return { items, totalLitres: total * unit };
}

export function areaFromRectangle(length, width) {
  const a = Number(length) * Number(width);
  return a > 0 ? a : 0;
}

export function areaFromWalls(totalWallLength, height, openings) {
  const a = Number(totalWallLength) * Number(height) - (Number(openings) || 0);
  return a > 0 ? a : 0;
}

// product: entry from PRODUCTS (needs packSizes). config: entry from ESTIMATOR_PRODUCTS.
// options: { area (m2), coats, variantIndex }
export function estimate(product, config, { area, coats, variantIndex = 0 }) {
  if (!config || !(area > 0) || !(coats > 0)) return null;
  const work = area * coats;
  if (config.needsReview) return { needsReview: true };

  if (config.kit) {
    const [low, high] = config.kit.coverage;
    const kitsFewest = Math.ceil(work / high - 1e-9);
    const kitsRecommended = Math.ceil(work / low - 1e-9);
    return {
      type: "kit", area, coats, work,
      kitsFewest, kitsRecommended,
      items: [{ size: config.kit.size, qty: kitsRecommended }],
      assumption: "Each kit (" + config.kit.size + ") covers " + low + "-" + high + " sq m per coat as stated in the catalogue. The recommended quantity uses the lower figure so you do not run short.",
    };
  }

  const variant = config.variants ? config.variants[variantIndex] : null;
  const [low, high] = (variant || config).perLitre;
  const litresFewest = round1(work / high);
  const litresRecommended = round1(work / low);
  const packs = product.packSizes.map(size => ({ size, litres: packLitres(size) })).filter(p => p.litres);
  const choice = chooseLitrePacks(work / low, packs);
  return {
    type: "litres", area, coats, work,
    litresFewest, litresRecommended,
    items: choice ? choice.items.map(i => ({ size: i.size, qty: i.qty })) : [],
    packLitres: choice ? choice.totalLitres : null,
    assumption: "One litre covers " + (low === high ? low : low + "-" + high) + " sq m per coat" + (variant ? " (" + variant.label + ")" : "") + ", as stated in the catalogue. The recommended quantity uses the lower figure so you do not run short.",
  };
}
