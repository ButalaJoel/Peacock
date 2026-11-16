import { useApp } from "../../context/useApp.js";
import { B } from "../../data/theme.js";

// Reminder shown under colours: screens do not show true paint colour. Also points to the visualiser.
export default function ScreenColourNote() {
  const { nav, makeHref } = useApp();
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 24px 40px" }}>
      <div style={{ background: "#fff8e6", border: "1px solid #f0dfb0", borderRadius: 12, padding: "14px 18px", fontSize: 13.5, color: "#5b4a14", lineHeight: 1.65 }}>
        <strong>Colours on screen are a guide only.</strong> They do not look exactly the same in real paint on a wall. Screens, cameras and lighting all change colour, so we recommend ordering a sample first.{" "}
        <a href={makeHref("visualiser")} onClick={e => { e.preventDefault(); nav("visualiser"); }} style={{ color: B.coral, fontWeight: 600 }}>Try this colour on your own photo</a>
      </div>
    </section>
  );
}
