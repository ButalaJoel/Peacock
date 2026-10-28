import { B } from "../../data/theme.js";
import { PaletteIcon } from "../icons/Icons.jsx";
import { useApp } from "../../context/useApp.js";

export default function AnnouncementBar() {
  const { addSampleBundle } = useApp();
  return (
    <>
      <div style={{ background: B.black, color: "#fff", fontSize: 13, padding: "8px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}>Request a quote for any product</span><button onClick={addSampleBundle} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "inherit", font: "inherit", cursor: "pointer" }}><PaletteIcon /> Order colour samples</button></div>
          <div className="dsk" style={{ display: "flex", gap: 20, fontSize: 12 }}><span style={{ cursor: "pointer" }}>Stockists</span><span style={{ cursor: "pointer" }}>Contact Us</span><span style={{ cursor: "pointer" }}>Professionals</span></div>
        </div>
      </div>
    </>
  );
}
