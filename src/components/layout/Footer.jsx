import { LOGO_FOOTER } from "../../data/images.js";
import { B } from "../../data/theme.js";
import { PhoneIcon, MailIcon } from "../icons/Icons.jsx";
import { useApp } from "../../context/useApp.js";

export default function Footer() {
  const { nav, makeHref, aReset } = useApp();
  return (
    <>
      <footer style={{ background: B.black, color: "#fff", padding: "60px 0 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="g5" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.5fr", gap: 40, paddingBottom: 40 }}>
            <div><div style={{ marginBottom: 20 }}><img src={LOGO_FOOTER} alt="" style={{ height: 50, filter: "invert(1)", mixBlendMode: "screen", opacity: .9 }} /></div><p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>The Painters' Paint. Premium paints for every room, surface, and style.</p></div>
            <div className="fc"><h4>Shop</h4><span onClick={() => nav("all-colours")}>Colours</span><span>Paint</span><span onClick={() => nav("bedroom-inspiration")}>Inspiration</span></div>
            <div className="fc"><h4>Company</h4><a href={makeHref("about")} onClick={e => { e.preventDefault(); nav("about"); }} style={aReset}>About Us</a><a href={makeHref("sustainability")} onClick={e => { e.preventDefault(); nav("sustainability"); }} style={aReset}>Sustainability</a><a href={makeHref("community")} onClick={e => { e.preventDefault(); nav("community"); }} style={aReset}>Community</a><a href={makeHref("foundation")} onClick={e => { e.preventDefault(); nav("foundation"); }} style={aReset}>Foundation</a></div>
            <div className="fc"><h4>Support</h4><span>Help & FAQs</span><span>Find Stockist</span><span>Delivery</span><span>Returns</span></div>
            <div className="fc"><h4>Contact</h4><p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.6, marginBottom: 16 }}>Questions? We're here to help.</p><p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 12 }}>Mon–Fri: 8:00–17:00</p><div style={{ display: "flex", gap: 16 }}><span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,.7)", cursor: "pointer" }}><PhoneIcon /> Call</span><span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,.7)", cursor: "pointer" }}><MailIcon /> Email</span></div></div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", gap: 20, fontSize: 12, color: "rgba(255,255,255,.4)" }}><span>Privacy</span><span>Terms</span><span>Cookies</span></div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>©2026 Peacock Paints Limited — The Painters' Paint</p>
          </div>
        </div>
      </footer>
    </>
  );
}
