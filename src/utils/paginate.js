// Pagination helpers for long lists.
export const pageCount = (total, perPage) => Math.max(1, Math.ceil(total / Math.max(1, perPage)));

export function paginate(items, page, perPage) {
  const pages = pageCount(items.length, perPage);
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  const start = (current - 1) * perPage;
  return { items: items.slice(start, start + perPage), page: current, pages, from: items.length ? start + 1 : 0, to: Math.min(items.length, start + perPage), total: items.length };
}

// Page buttons to show, with "..." gaps: [1, "...", 4, 5, 6, "...", 12]
export function pageList(current, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set([1, pages, current, current - 1, current + 1]);
  if (current <= 3) { set.add(2); set.add(3); set.add(4); }
  if (current >= pages - 2) { set.add(pages - 1); set.add(pages - 2); set.add(pages - 3); }
  const nums = Array.from(set).filter(n => n >= 1 && n <= pages).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => { if (i > 0 && n - nums[i - 1] > 1) out.push("..."); out.push(n); });
  return out;
}
