import { useApp } from "../../context/useApp.js";
import { B } from "../../data/theme.js";
import { PaletteIcon } from "../icons/Icons.jsx";

export default function AnnouncementBar() {
  const { nav, makeHref, addSampleBundle } = useApp();
  const link = (page, label) => (
    <a href={makeHref(page)} onClick={e => { e.preventDefault(); nav(page); }} className="ann-link">{label}</a>
  );
  return (
    <div style={{ background: B.black, color: "#fff", fontSize: 12.5, padding: "7px 0" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <span>Request a quote for any product</span>
          <button onClick={addSampleBundle} className="ann-link" style={{ background: "none", border: "none", color: "inherit", font: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, padding: 0 }}>
            <PaletteIcon /> Order colour samples
          </button>
        </div>
        <div className="dsk" style={{ display: "flex", gap: 22 }}>
          {link("distributor", "Become a Distributor")}
          {link("contact", "Contact Us")}
          {link("professionals", "Professionals")}
        </div>
      </div>
    </div>
  );
}
