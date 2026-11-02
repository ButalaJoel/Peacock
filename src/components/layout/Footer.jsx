import { useApp } from "../../context/useApp.js";
import { CONTACT } from "../../config/contact.js";
import { B } from "../../data/theme.js";
import { LOGO_FOOTER } from "../../data/images.js";
import { PhoneIcon, MailIcon } from "../icons/Icons.jsx";

export default function Footer() {
  const { nav, makeHref, setQuoteOpen } = useApp();
  const page = (slug, label) => (
    <a href={makeHref(slug)} onClick={e => { e.preventDefault(); nav(slug); }}>{label}</a>
  );
  return (
    <footer style={{ background: B.black, color: "#fff", padding: "60px 0 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="g5" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1.6fr", gap: 40, paddingBottom: 40 }}>
          <div>
            <div style={{ display: "inline-block", background: "#fff", borderRadius: 12, padding: "10px 16px", marginBottom: 18 }}>
              <img src={LOGO_FOOTER} alt="Peacock Paints" style={{ height: 44, display: "block" }} />
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.6 }}>Protect. Preserve. Prolong.<br />Proudly made in Uganda.</p>
          </div>
          <div className="fc"><h4>Products</h4>{page("decorative-paints", "Decorative Paints")}{page("industrial-coatings", "Industrial Coatings")}{page("wood-care-paints", "Wood Care Paints")}{page("thinners-solvents", "Thinners & Solvents")}</div>
          <div className="fc"><h4>Explore</h4>{page("all-colours", "Colours")}{page("colour-systems", "Colour systems")}{page("bedroom-inspiration", "Inspiration")}{page("estimator", "Paint estimator")}</div>
          <div className="fc"><h4>Company</h4>{page("about", "About Us")}{page("vision", "Vision and Mission")}{page("why-peacock", "Why Peacock Paints")}{page("professionals", "Professionals")}{page("distributor", "Become a Distributor")}</div>
          <div className="fc">
            <h4>Contact</h4>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.7)", lineHeight: 1.7, marginBottom: 12 }}>{CONTACT.address}</p>
            <a href={"tel:" + CONTACT.phones[0].replace(/[^+\d]/g, "")} style={{ display: "flex", alignItems: "center", gap: 8 }}><PhoneIcon /> {CONTACT.phones.join(" / ")}</a>
            <a href={"mailto:" + CONTACT.salesEmail} style={{ display: "flex", alignItems: "center", gap: 8 }}><MailIcon /> {CONTACT.salesEmail}</a>
            <a href="#" onClick={e => { e.preventDefault(); setQuoteOpen(true); }} style={{ color: "#fff", fontWeight: 600 }}>Request a quote</a>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>©2026 Peacock Paints Limited</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>{CONTACT.website}</p>
        </div>
      </div>
    </footer>
  );
}
