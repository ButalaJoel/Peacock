import { useApp } from "../context/useApp.js";
import { NAV, resolvePage } from "../data/navData.js";
import { CONTACT } from "../config/contact.js";
import { B } from "../data/theme.js";
import PageHero from "../components/common/PageHero.jsx";

const GRADIENT = "linear-gradient(135deg, #1F6F78, #2A9AA5)";
const box = { maxWidth: 820, margin: "0 auto", padding: "44px 24px 80px", lineHeight: 1.8, fontSize: 15 };

// /advice: a landing page listing every help and advice page (this is a menu group elsewhere on the site).
export function AdvicePage() {
  const { nav, makeHref, setQuoteOpen } = useApp();
  const group = NAV.find(m => m.id === "advice").groups[0];
  return (
    <div>
      <PageHero kicker="Advice" title="Help and advice" subtitle="Tools and guidance from the Peacock Paints team." gradient={GRADIENT} />
      <div style={box}>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {group.links.map(l => {
            const page = l.action ? null : resolvePage(l);
            return (
              <li key={l.label}>
                {l.action === "quote"
                  ? <a href={makeHref("get-a-quote")} onClick={e => { e.preventDefault(); setQuoteOpen(true); }} style={{ color: B.coral, fontWeight: 600 }}>{l.label}</a>
                  : <a href={makeHref(page || l.page)} onClick={e => { e.preventDefault(); nav(page || l.page); }} style={{ color: B.coral, fontWeight: 600 }}>{l.label}</a>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// /get-a-quote: the quote request form opens as a pop-up; this page gives the same details in plain text.
export function QuotePage() {
  const { setQuoteOpen } = useApp();
  return (
    <div>
      <PageHero kicker="Quotes" title="Request a quote" subtitle="Tell us what you need and our sales team will send you a quotation." gradient={GRADIENT} />
      <div style={box}>
        <p>Peacock Paints works by quotation. Choose your products and quantities, then send your request on WhatsApp or by email, and our sales team will reply with a quotation.</p>
        <button className="btn bp" onClick={() => setQuoteOpen(true)} style={{ background: B.coral, marginTop: 18 }}>Open the quote form</button>
        <p style={{ marginTop: 24 }}>Or contact sales directly: {CONTACT.phones.join(" or ")}, or <a href={"mailto:" + CONTACT.salesEmail} style={{ color: B.coral }}>{CONTACT.salesEmail}</a>.</p>
      </div>
    </div>
  );
}
