import { B } from "../data/theme.js";

// Shared look for the dashboard screens.
export const S = {
  wrap: { maxWidth: 1100, margin: "0 auto", padding: "36px 24px 70px" },
  card: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 14, padding: 22 },
  label: { display: "block", fontSize: 12, fontWeight: 700, letterSpacing: .6, textTransform: "uppercase", color: "#666", margin: "16px 0 6px" },
  input: { width: "100%", padding: "11px 13px", border: "1px solid #d6d6d6", borderRadius: 9, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", background: "#fff" },
  hint: { fontSize: 12, color: "#888", marginTop: 5, lineHeight: 1.5 },
  btn: { padding: "11px 22px", borderRadius: 9, border: "none", background: B.coral, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  btnGhost: { padding: "10px 18px", borderRadius: 9, border: "1px solid #ccc", background: "#fff", color: "#333", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  small: { padding: "6px 12px", borderRadius: 7, border: "1px solid #d0d0d0", background: "#fff", color: "#333", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
};
export const msgStyle = ok => ({ padding: "11px 14px", borderRadius: 9, fontSize: 14, marginBottom: 16, background: ok ? "#e9f6ee" : "#fdecea", color: ok ? "#1d6b3a" : "#a12b1f", border: "1px solid " + (ok ? "#bfe3cb" : "#f3c2bc") });
