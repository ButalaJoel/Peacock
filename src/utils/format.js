// "2026-11-02" -> "November 2026"
export const formatMonth = iso => {
  const d = new Date(iso + "T00:00:00");
  return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};
export const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
