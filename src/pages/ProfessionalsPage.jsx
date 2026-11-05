import ProfessionalRequestForm from "../components/professionals/ProfessionalRequestForm.jsx";
import { useApp } from "../context/useApp.js";
import { B } from "../data/theme.js";
import PageHero from "../components/common/PageHero.jsx";

export default function ProfessionalsPage() {
  const { nav, makeHref, setQuoteOpen } = useApp();
  const items = [
    { t: "Technical support", d: "From colour selection and substrate preparation to on-site technical guidance, our expert team supports you at every stage.", cta: "Contact our team", page: "contact" },
    { t: "Complete paint systems", d: "A full range of Decorative, Industrial and Wood Care coatings, supported by compatible primers, sealers, construction chemicals and project accessories.", cta: "Browse products", page: "decorative-paints" },
    { t: "Internationally recognised colour systems", d: "Peacock Paints, NCS, BS 4800, NOVA and RAL, for reliable specification and colour matching.", cta: "Colour systems", page: "colour-systems" },
    { t: "Estimate your quantities", d: "Work out how much paint a job needs, using the coverage figures in our catalogue.", cta: "Paint estimator", page: "estimator" },
    { t: "Request a quotation", d: "Tell us what you need and our sales team will send you a quotation.", cta: "Get a quote", action: "quote" },
    { t: "Become a distributor", d: "Grow your business with a trusted, locally manufactured paint brand.", cta: "Express interest", page: "distributor" },
  ];
  return (
    <div>
      <PageHero kicker="Professionals" title="Support for professionals" subtitle="Specified by professionals and institutions across East Africa, including homes, hotels, factories, schools, hospitals and public buildings." gradient="linear-gradient(135deg, #2f3a40, #151a1d)" />
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px 70px" }}>
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {items.map(it => (
            <div key={it.t} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: 17, marginBottom: 8 }}>{it.t}</h3>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.65, marginBottom: 16, flex: 1 }}>{it.d}</p>
              <a href={it.action ? "#" : makeHref(it.page)} onClick={e => { e.preventDefault(); if (it.action) setQuoteOpen(true); else nav(it.page); }}
                style={{ color: B.coral, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>{it.cta} →</a>
            </div>
          ))}
        </div>
      </section>
      <ProfessionalRequestForm />
    </div>
  );
}
