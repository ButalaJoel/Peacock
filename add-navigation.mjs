// Navigation redesign: floating pill bar, announcement strip, new menus, and the pages they open.
// Run from the project root:  node add-navigation.mjs
//
// REPLACES (git keeps the old versions): Header, MobileMenu, AnnouncementBar, Footer, navData.js, storyPages.js
// NEW pages: Contact, Become a Distributor, Professionals, Colour systems (+ a small PageHero banner)
// EDITS: PageSwitch (routes), contact.js (address, phones, website), Hero.jsx (founding year), QuoteModal (empty state),
//        InfoCards.jsx (no stockists), global.css (pill nav styles)
// Content comes from the catalogue: founded 1988 (not 1962), vision, mission, values, awards, contact details.
// The old Sustainability, Community and Foundation pages are removed: the catalogue has nothing to support them.
// Every check must pass first, otherwise nothing is changed.   Undo: git checkout . ; git clean -fd src

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const NEW_FILES = {
  "src/data/navData.js": String.raw`// Navigation: every link points to a page that exists.
// link = { label, page }          opens a page
//        { label, action: "quote" }  opens the quote form
// Colour family links ("Whites", "Blues"...) and style links ("Modern"...) find their page from the colour data.
import { COLOUR_CATEGORIES, STYLE_CATEGORIES, CAT_SWATCH_COLORS } from "./colours.js";

export const NAV = [
  {
    id: "story", label: "Our Story",
    groups: [
      { title: "Company", links: [
        { label: "About Us", page: "about" },
        { label: "Vision, Mission and Values", page: "vision" },
        { label: "Why Peacock Paints", page: "why-peacock" },
        { label: "Contact Us", page: "contact" },
      ] },
    ],
    cards: [
      { title: "ABOUT US", desc: "Proudly made in Uganda since 1988", cta: "Learn more", page: "about", bg: "#E8603C", dark: true },
      { title: "WHY PEACOCK PAINTS", desc: "Protect. Preserve. Prolong.", cta: "Read more", page: "why-peacock", bg: "#2BB5A0", dark: true },
    ],
  },
  {
    id: "products", label: "Products",
    groups: [
      { title: "Decorative", links: [
        { label: "Interior Paints", page: "decorative-paints-interior" },
        { label: "Exterior Paints", page: "decorative-paints-exterior" },
        { label: "Primers", page: "decorative-paints-primers" },
      ], footer: { label: "All decorative paints", page: "decorative-paints" } },
      { title: "Industrial", links: [
        { label: "General Coatings", page: "industrial-coatings-general" },
        { label: "Waterproofing & Construction", page: "industrial-coatings-waterproofing" },
      ], footer: { label: "All industrial coatings", page: "industrial-coatings" } },
      { title: "Wood care and solvents", links: [
        { label: "Wood Care Paints", page: "wood-care-paints" },
        { label: "Thinners & Solvents", page: "thinners-solvents" },
      ] },
    ],
    cards: [
      { title: "PAINT ESTIMATOR", desc: "Work out how much you need", cta: "Try it", page: "estimator", bg: "#c8d8e8" },
      { title: "REQUEST A QUOTE", desc: "Tell us what you need", cta: "Get a quote", action: "quote", bg: "#e8dcc8" },
    ],
  },
  {
    id: "colours", label: "Colours",
    groups: [
      { title: "By colour", type: "families", footer: { label: "Shop all colours", page: "all-colours" } },
      { title: "Colour systems", links: [{ label: "Our colour systems", page: "colour-systems" }] },
    ],
    cards: [
      { title: "ALL COLOURS", desc: "Browse the Peacock colour guide", cta: "Shop colours", page: "all-colours", bg: "#e8d5c4" },
      { title: "COLOUR SYSTEMS", desc: "Peacock, NCS, BS 4800, NOVA and RAL", cta: "Learn more", page: "colour-systems", bg: "#d4e0c8" },
    ],
  },
  {
    id: "inspiration", label: "Inspiration",
    groups: [
      { title: "By room", links: [
        { label: "Bedroom", page: "bedroom-inspiration" },
        { label: "Living Room", page: "livingroom-inspiration" },
        { label: "Dining Room", page: "diningroom-inspiration" },
        { label: "Kitchen", page: "kitchen-inspiration" },
        { label: "Bathroom", page: "bathroom-inspiration" },
      ] },
      { title: "By style", links: ["Contemporary", "Modern", "Boho", "Farmhouse", "Scandi", "Eclectic"].map(label => ({ label })) },
    ],
    cards: [
      { title: "GREEN HUES", desc: "Versatile greens", cta: "Browse", page: "greens-colour", bg: "#c4d8c0" },
      { title: "KITCHENS", desc: "Kitchen makeover ideas", cta: "Get inspired", page: "kitchen-inspiration", bg: "#2d4a3e", dark: true },
    ],
  },
  {
    id: "advice", label: "Advice",
    groups: [
      { title: "Help and advice", links: [
        { label: "Paint Estimator", page: "estimator" },
        { label: "Ask an expert", page: "contact" },
        { label: "Request a quote", action: "quote" },
      ] },
    ],
    cards: [
      { title: "ASK AN EXPERT", desc: "Talk to our team", cta: "Contact us", page: "contact", bg: "#c8d0d8" },
    ],
  },
  {
    id: "professionals", label: "Professionals",
    groups: [
      { title: "For professionals", links: [
        { label: "Professionals overview", page: "professionals" },
        { label: "Become a Distributor", page: "distributor" },
        { label: "Colour systems", page: "colour-systems" },
        { label: "Request a quote", action: "quote" },
      ] },
    ],
    cards: [
      { title: "BECOME A DISTRIBUTOR", desc: "Grow with Peacock Paints", cta: "Apply", page: "distributor", bg: "#5C2D6D", dark: true },
      { title: "TECHNICAL SUPPORT", desc: "From colour selection to site guidance", cta: "Contact us", page: "contact", bg: "#e0d4c8" },
    ],
  },
];

// The page a link opens.
export function resolvePage(link) {
  if (link.page) return link.page;
  if (COLOUR_CATEGORIES[link.label]) return COLOUR_CATEGORIES[link.label].slug;
  if (STYLE_CATEGORIES[link.label]) return STYLE_CATEGORIES[link.label].slug;
  return "home";
}

// The colour families shown with a coloured dot.
export function familyLinks() {
  return Object.keys(COLOUR_CATEGORIES).map(name => ({
    label: name,
    page: COLOUR_CATEGORIES[name].slug,
    count: COLOUR_CATEGORIES[name].colors.length,
    color: CAT_SWATCH_COLORS[name] || "#ddd",
  }));
}

// Which top menu a page belongs to, so the right menu stays highlighted.
export function menuForPage(pg) {
  if (["about", "vision", "why-peacock", "contact"].includes(pg)) return "story";
  if (pg === "product" || pg.startsWith("decorative-paints") || pg.startsWith("industrial-coatings") || pg === "wood-care-paints" || pg === "thinners-solvents") return "products";
  if (pg === "all-colours" || pg === "colour-detail" || pg === "colour-systems" || pg.endsWith("-colour")) return "colours";
  if (pg.endsWith("-inspiration") || pg.endsWith("-style")) return "inspiration";
  if (pg === "estimator") return "advice";
  if (pg === "professionals" || pg === "distributor") return "professionals";
  return null;
}
`,
  "src/data/storyPages.js": String.raw`// Our Story pages. Everything here comes from the Peacock Paints catalogue (CATALOGUE_2026.pdf).
// The earlier Sustainability, Community and Foundation pages were removed because the catalogue does not support them.
// Add them back when the company supplies approved text.
import { B } from "./theme.js";

export const storyPages = {
  about: {
    title: "About Peacock Paints",
    subtitle: "Protect. Preserve. Prolong.",
    hg: "linear-gradient(135deg, " + B.coral + "ee, " + B.coralDk + ")",
    sections: [
      { t: "Who we are", i: "globe", c: "Peacock Paints Limited is a proudly East African paint manufacturing company committed to delivering innovative, affordable and high-quality coating solutions that beautify and protect surfaces in homes, industries and institutions.\n\nBuilt on a legacy of research, durability and customer trust, we continue to redefine paint experiences across the region through consistent standards and product performance." },
      { t: "Our history", i: "heart", c: "Peacock Paints Limited was founded in August 1988 and began operations at Plot 95, Sixth Street, Industrial Area, Kampala. In January 1997, the company relocated to its current premises at Plot 56, Sixth Street, Industrial Area.\n\nWe were established at a time when most paint products on the Ugandan market were imported from Kenya. As the nation emerged from a period of political and economic challenges, demand grew for reliable, locally manufactured paint solutions. Peacock Paints was created to meet that need, providing quality coatings designed for local conditions and customer expectations." },
      { t: "What we make", i: "palette", c: "A full range of Decorative, Industrial and Wood Care coatings, supported by compatible primers, sealers, construction chemicals, custom coatings and painting accessories, from surface preparation to final finish." },
      { t: "Awards and recognition", i: "users", c: "Best exhibitor at UGITF in 2007, 2008 and 2011.\n\nBest Paint at KACITA 2009/10.\n\nBest overall exhibitor at PEWOSA.\n\nTop 100 Mid Sized Companies, 2017." },
    ],
    stats: [{ n: "1988", l: "Founded" }, { n: "36+", l: "Years" }, { n: "3", l: "Product ranges" }, { n: "Uganda", l: "Made in" }],
  },
  vision: {
    title: "Vision, Mission and Values",
    subtitle: "What guides Peacock Paints",
    hg: "linear-gradient(135deg, " + B.teal + "ee, " + B.tealDk + ")",
    sections: [
      { t: "Our vision", i: "globe", c: "To be a leading paint and coatings manufacturer in the East African region." },
      { t: "Our mission", i: "heart", c: "We focus on customer satisfaction by applying relevant product expertise to deliver high quality, standardized products at competitively affordable prices." },
      { t: "Our core values", i: "users", c: "Excellence\n\nTeamwork\n\nIntegrity\n\nHonesty" },
    ],
    stats: [{ n: "Excellence", l: "Core value" }, { n: "Teamwork", l: "Core value" }, { n: "Integrity", l: "Core value" }, { n: "Honesty", l: "Core value" }],
  },
  "why-peacock": {
    title: "Why choose Peacock Paints?",
    subtitle: "Protect. Preserve. Prolong.",
    hg: "linear-gradient(135deg, " + B.gold + "ee, #C89820)",
    sections: [
      { t: "Locally manufactured excellence", i: "globe", c: "Proudly made in Uganda to world-class standards, our products are formulated to perform in tropical conditions, resisting heavy rainfall, intense sunlight, humidity and everyday wear." },
      { t: "Complete paint system solutions", i: "palette", c: "A full range of Decorative, Industrial and Wood Care coatings supported by compatible primers, sealers, construction chemicals and project accessories, from surface preparation to final finish." },
      { t: "Customer-focused support", i: "users", c: "From colour selection and substrate preparation to on-site technical guidance, our expert team supports you at every stage to help you achieve impeccable finishes." },
      { t: "Technology-driven formulas", i: "leaf", c: "We use advanced colour pigments, eco-conscious binders and durable resin technology to deliver rich colour, long-lasting performance and environmentally responsible coatings." },
      { t: "Trusted across East Africa", i: "heart", c: "Specified by professionals and institutions across the region, including homes, hotels, factories, schools, hospitals and public buildings. Peacock Paints is known for reliability, value and outstanding performance." },
      { t: "More than colour", i: "truck", c: "We help you protect your investment, elevate spaces and create lasting impressions, because every surface deserves a finish that works as hard as you do." },
    ],
    stats: [{ n: "30+", l: "Years of coatings" }, { n: "5", l: "Colour systems" }, { n: "3", l: "Product ranges" }, { n: "Uganda", l: "Made in" }],
  },
};
`,
  "src/utils/messaging.js": String.raw`// Helpers for forms that hand a message to WhatsApp or the visitor's email app.
// Nothing is stored on a server: the visitor presses send in WhatsApp or their email app.
export const makeReference = prefix => {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return prefix + "-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + rand;
};
export const whatsappReady = number => /^\d{8,15}$/.test(number || "");
export const whatsappUrl = (number, text) => "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
export const mailtoUrl = (email, subject, text) => "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
`,
  "src/components/layout/AnnouncementBar.jsx": String.raw`import { useApp } from "../../context/useApp.js";
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
`,
  "src/components/layout/Header.jsx": String.raw`import { useEffect, useState } from "react";
import { useApp } from "../../context/useApp.js";
import { NAV, menuForPage, resolvePage, familyLinks } from "../../data/navData.js";
import { LOGO_HEADER } from "../../data/images.js";
import { SearchIcon, CartIcon, MenuIcon, ChevDown, Arr } from "../icons/Icons.jsx";

export default function Header() {
  const { activeMenu, mE, mL, setActiveMenu, scrolled, nav, makeHref, pg, cartCount, setCartOpen, setSearchOpen, setMobMenu, setQuoteOpen } = useApp();
  const [pinned, setPinned] = useState(null);

  // clicking elsewhere or pressing Escape closes a menu that was opened by a click
  useEffect(() => {
    const close = () => { setPinned(null); setActiveMenu(null); };
    const onDown = e => { if (!e.target.closest || !e.target.closest(".pill-header")) close(); };
    const onKey = e => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [setActiveMenu]);

  const go = (e, link) => {
    e.preventDefault();
    setActiveMenu(null);
    setPinned(null);
    if (link.action === "quote") { setQuoteOpen(true); return; }
    nav(resolvePage(link));
  };
  const hrefFor = link => (link.action ? "#" : makeHref(resolvePage(link)));
  const currentMenu = menuForPage(pg);
  const menu = activeMenu !== null ? NAV[activeMenu] : null;
  const leave = () => { if (pinned === null) mL(); };

  return (
    <header className="pill-header">
      <div className={"pill-bar" + (scrolled ? " pill-scrolled" : "")} onMouseLeave={leave}>
        <a href={makeHref("home")} onClick={e => { e.preventDefault(); setActiveMenu(null); nav("home"); }} className="pill-logo">
          <img src={LOGO_HEADER} alt="Peacock Paints" />
        </a>

        <nav className="dsk pill-nav" aria-label="Main">
          {NAV.map((m, i) => (
            <button key={m.id}
              className={"pill-item" + (activeMenu === i ? " is-open" : "") + (currentMenu === m.id ? " is-current" : "")}
              aria-expanded={activeMenu === i}
              onMouseEnter={() => { if (pinned !== null && pinned !== i) setPinned(null); mE(i); }}
              onClick={() => { setPinned(pinned === i ? null : i); mE(i); }}>
              {m.label} <ChevDown />
            </button>
          ))}
        </nav>

        <div className="pill-actions">
          <button className="pill-icon" aria-label="Search" onClick={() => setSearchOpen(true)}><SearchIcon /></button>
          <button className="pill-icon" aria-label="Cart" onClick={() => setCartOpen(true)}>
            <CartIcon />
            {cartCount > 0 && <span className="pill-badge">{cartCount}</span>}
          </button>
          <button className="dsk pill-cta" onClick={() => setQuoteOpen(true)}>Get a quote</button>
          <button className="mob pill-icon" aria-label="Menu" onClick={() => setMobMenu(true)}><MenuIcon /></button>
        </div>
      </div>

      {menu && (
        <div className="pill-mega dsk" onMouseEnter={() => mE(activeMenu)} onMouseLeave={leave}>
          <div className="pill-mega-inner" style={{ gridTemplateColumns: menu.groups.map(g => (g.type === "families" ? "1.7fr" : "1fr")).join(" ") + " 1.1fr" }}>
            {menu.groups.map(group => (
              <div key={group.title}>
                <h3 className="pill-group-title">{group.title}</h3>
                {group.type === "families" ? (
                  <div className="pill-fam">
                    {familyLinks().map(f => (
                      <a key={f.label} className="pill-link" href={makeHref(f.page)} onClick={e => go(e, f)}>
                        <span className="pill-dot" style={{ background: f.color }} />
                        <span>{f.label}<small style={{ display: "block", fontSize: 10.5, color: "#aaa" }}>{f.count} shades</small></span>
                      </a>
                    ))}
                  </div>
                ) : group.links.map(link => (
                  <a key={link.label} className="pill-link" href={hrefFor(link)} onClick={e => go(e, link)}>{link.label}</a>
                ))}
                {group.footer && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #eee" }}>
                    <a className="pill-link pill-footer-link" href={makeHref(group.footer.page)} onClick={e => go(e, group.footer)}>{group.footer.label}</a>
                  </div>
                )}
              </div>
            ))}
            <div className="pill-cards">
              {menu.cards.map(card => (
                <a key={card.title} className="pill-card" href={hrefFor(card)} onClick={e => go(e, card)} style={{ background: card.bg, color: card.dark ? "#fff" : "#1a1a1a" }}>
                  <h4 style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>{card.title}</h4>
                  <p style={{ fontSize: 12.5, lineHeight: 1.5, opacity: .88, marginBottom: 8 }}>{card.desc}</p>
                  <span style={{ fontSize: 12.5, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>{card.cta} <Arr /></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
`,
  "src/components/layout/MobileMenu.jsx": String.raw`import { useApp } from "../../context/useApp.js";
import { NAV, resolvePage, familyLinks } from "../../data/navData.js";
import { LOGO_HEADER } from "../../data/images.js";
import { CloseIcon, ChevRight } from "../icons/Icons.jsx";

export default function MobileMenu() {
  const { mobMenu, setMobMenu, mobSub, setMobSub, nav, makeHref, setQuoteOpen } = useApp();
  if (!mobMenu) return null;

  const close = () => { setMobMenu(false); setMobSub(null); };
  const go = (e, link) => {
    e.preventDefault();
    close();
    if (link.action === "quote") { setQuoteOpen(true); return; }
    nav(resolvePage(link));
  };
  const hrefFor = link => (link.action ? "#" : makeHref(resolvePage(link)));
  const row = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 20px", borderBottom: "1px solid #f0f0f0", fontSize: 15, color: "#222", textDecoration: "none", cursor: "pointer", background: "none", borderLeft: "none", borderRight: "none", borderTop: "none", width: "100%", fontFamily: "inherit", textAlign: "left" };
  const menu = mobSub !== null ? NAV[mobSub] : null;

  return (
    <>
      <div className="mo" onClick={close} />
      <div className="md">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #eee" }}>
          {menu ? (
            <>
              <span style={{ fontWeight: 600 }}>{menu.label}</span>
              <button onClick={() => setMobSub(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#E8603C", fontWeight: 600 }}>Back</button>
            </>
          ) : (
            <>
              <img src={LOGO_HEADER} alt="Peacock Paints" style={{ height: 36 }} />
              <button onClick={close} aria-label="Close menu" style={{ background: "none", border: "none", cursor: "pointer" }}><CloseIcon /></button>
            </>
          )}
        </div>

        {!menu && (
          <div>
            {NAV.map((m, i) => (
              <button key={m.id} onClick={() => setMobSub(i)} style={row}><span style={{ fontWeight: 500 }}>{m.label}</span><ChevRight /></button>
            ))}
            <div style={{ padding: 20 }}>
              <button className="btn bp" style={{ width: "100%", justifyContent: "center" }} onClick={() => { close(); setQuoteOpen(true); }}>Get a quote</button>
            </div>
          </div>
        )}

        {menu && (
          <div>
            {menu.groups.map(group => (
              <div key={group.title}>
                <p style={{ padding: "14px 20px 4px", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#E8603C" }}>{group.title}</p>
                {group.type === "families"
                  ? familyLinks().map(f => (
                      <a key={f.label} href={makeHref(f.page)} onClick={e => go(e, f)} style={row}>
                        <span style={{ display: "flex", alignItems: "center", gap: 10 }}><span className="pill-dot" style={{ background: f.color }} />{f.label}</span>
                        <span style={{ fontSize: 12, color: "#aaa" }}>{f.count}</span>
                      </a>
                    ))
                  : group.links.map(link => (
                      <a key={link.label} href={hrefFor(link)} onClick={e => go(e, link)} style={row}>{link.label}</a>
                    ))}
                {group.footer && <a href={makeHref(group.footer.page)} onClick={e => go(e, group.footer)} style={{ ...row, color: "#E8603C", fontWeight: 600 }}>{group.footer.label}</a>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
`,
  "src/components/layout/Footer.jsx": String.raw`import { useApp } from "../../context/useApp.js";
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
`,
  "src/components/common/PageHero.jsx": String.raw`// Coloured banner at the top of the information pages.
export default function PageHero({ kicker, title, subtitle, gradient }) {
  return (
    <section style={{ background: gradient, padding: "64px 0 52px", color: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        {kicker && <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, marginBottom: 14, opacity: .85, fontWeight: 600 }}>{kicker}</p>}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 700, marginBottom: 14 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 18, opacity: .92, fontWeight: 300, lineHeight: 1.6 }}>{subtitle}</p>}
      </div>
    </section>
  );
}
`,
  "src/pages/ContactPage.jsx": String.raw`import { useState } from "react";
import { CONTACT } from "../config/contact.js";
import { B } from "../data/theme.js";
import { makeReference, whatsappReady, whatsappUrl, mailtoUrl } from "../utils/messaging.js";
import PageHero from "../components/common/PageHero.jsx";
import { PhoneIcon, MailIcon, GlobeIcon } from "../components/icons/Icons.jsx";

const TOPICS = ["Ask an expert", "Product enquiry", "Colour matching", "Something else"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", topic: TOPICS[0], message: "" });
  const [reference] = useState(() => makeReference("PP-MSG"));
  const [touched, setTouched] = useState(false);
  const [sentVia, setSentVia] = useState(null);
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const missing = !form.name.trim() || !form.phone.trim() || !form.message.trim();
  const ready = whatsappReady(CONTACT.whatsappNumber);

  const text = [
    "Message - " + CONTACT.companyName + " website",
    "Reference: " + reference,
    "Topic: " + form.topic,
    "",
    "Name: " + form.name.trim(),
    "Phone: " + form.phone.trim(),
    form.email.trim() ? "Email: " + form.email.trim() : null,
    "",
    form.message.trim(),
  ].filter(l => l !== null).join("\n");

  const send = kind => {
    setTouched(true);
    if (missing) return;
    if (kind === "whatsapp") { window.open(whatsappUrl(CONTACT.whatsappNumber, text), "_blank", "noopener"); setSentVia("WhatsApp"); }
    else { window.location.href = mailtoUrl(CONTACT.salesEmail, "Message " + reference, text); setSentVia("your email app"); }
  };

  const card = { background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 28 };
  const label = { fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 };
  const bad = key => (touched && !form[key].trim() ? { borderColor: "#c0392b" } : null);
  const detail = { display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16, fontSize: 14.5, lineHeight: 1.6, color: "#444" };

  return (
    <div>
      <PageHero kicker="Contact us" title="Talk to our team" subtitle="From colour selection and surface preparation to on-site technical guidance, our team is here to help." gradient={"linear-gradient(135deg, " + B.coral + "ee, " + B.coralDk + ")"} />
      <section className="g2" style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px 70px", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 28, alignItems: "start" }}>
        <div style={card}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 20 }}>{CONTACT.companyName}</h2>
          <div style={detail}><GlobeIcon /><span>{CONTACT.address}</span></div>
          <div style={detail}><PhoneIcon /><span>{CONTACT.phones.map((p, i) => (<span key={p}>{i > 0 ? " / " : ""}<a href={"tel:" + p.replace(/[^+\d]/g, "")} style={{ color: "inherit" }}>{p}</a></span>))}</span></div>
          <div style={detail}><MailIcon /><a href={"mailto:" + CONTACT.salesEmail} style={{ color: "inherit" }}>{CONTACT.salesEmail}</a></div>
          <div style={detail}><GlobeIcon /><span>{CONTACT.website}</span></div>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 20, marginBottom: 4 }}>Send us a message</h2>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>Reference {reference}. This opens WhatsApp or your email app with your message ready to send.</p>
          <div style={{ marginBottom: 14 }}><label style={label}>Your name *</label><input className="si" value={form.name} onChange={set("name")} style={bad("name")} /></div>
          <div style={{ marginBottom: 14 }}><label style={label}>Phone number *</label><input className="si" type="tel" value={form.phone} onChange={set("phone")} style={bad("phone")} /></div>
          <div style={{ marginBottom: 14 }}><label style={label}>Email (optional)</label><input className="si" type="email" value={form.email} onChange={set("email")} /></div>
          <div style={{ marginBottom: 14 }}><label style={label}>Topic</label>
            <select className="si" value={form.topic} onChange={set("topic")}>{TOPICS.map(t => <option key={t}>{t}</option>)}</select>
          </div>
          <div style={{ marginBottom: 14 }}><label style={label}>Message *</label><textarea className="si" rows={4} value={form.message} onChange={set("message")} style={{ resize: "vertical", ...(bad("message") || {}) }} /></div>
          {touched && missing && <p style={{ fontSize: 13, color: "#c0392b", marginBottom: 12 }}>Please add your name, phone number and a message.</p>}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn bp" onClick={() => send("whatsapp")} disabled={!ready} style={{ flex: 1, justifyContent: "center", background: ready ? B.teal : "#ccc", cursor: ready ? "pointer" : "not-allowed" }}>Send on WhatsApp</button>
            <button className="btn bd" onClick={() => send("email")} style={{ flex: 1, justifyContent: "center" }}>Send by email</button>
          </div>
          {sentVia && <p style={{ fontSize: 13, marginTop: 16, padding: 14, background: "#eef7f4", borderRadius: 8, lineHeight: 1.6 }}>Your message is ready in {sentVia}. <strong>Press send there</strong> so it reaches our team. Nothing has been sent until you do.</p>}
        </div>
      </section>
    </div>
  );
}
`,
  "src/pages/DistributorPage.jsx": String.raw`import { useState } from "react";
import { CONTACT } from "../config/contact.js";
import { B } from "../data/theme.js";
import { makeReference, whatsappReady, whatsappUrl, mailtoUrl } from "../utils/messaging.js";
import PageHero from "../components/common/PageHero.jsx";

const STEPS = [
  { n: "1", t: "Tell us about your business", d: "Fill in the short form below with your business details and where you operate." },
  { n: "2", t: "We review your request", d: "Our team looks at every request and may contact you for more information." },
  { n: "3", t: "We get back to you", d: "If it is a good fit, our sales team will talk you through the next steps." },
];

export default function DistributorPage() {
  const empty = { kind: "Distributor", business: "", person: "", phone: "", email: "", location: "", experience: "", ack: false };
  const [form, setForm] = useState(empty);
  const [reference] = useState(() => makeReference("PP-DIST"));
  const [touched, setTouched] = useState(false);
  const [sentVia, setSentVia] = useState(null);
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const missing = !form.business.trim() || !form.person.trim() || !form.phone.trim() || !form.location.trim() || !form.ack;
  const ready = whatsappReady(CONTACT.whatsappNumber);

  const text = [
    "Expression of interest: " + form.kind + " - " + CONTACT.companyName + " website",
    "Reference: " + reference,
    "",
    "Business: " + form.business.trim(),
    "Contact person: " + form.person.trim(),
    "Phone: " + form.phone.trim(),
    form.email.trim() ? "Email: " + form.email.trim() : null,
    "Location: " + form.location.trim(),
    form.experience.trim() ? "" : null,
    form.experience.trim() ? "Business experience: " + form.experience.trim() : null,
    "",
    "I understand this is an expression of interest and does not make me a dealer or distributor.",
  ].filter(l => l !== null).join("\n");

  const send = kind => {
    setTouched(true);
    if (missing) return;
    if (kind === "whatsapp") { window.open(whatsappUrl(CONTACT.whatsappNumber, text), "_blank", "noopener"); setSentVia("WhatsApp"); }
    else { window.location.href = mailtoUrl(CONTACT.salesEmail, "Distributor interest " + reference, text); setSentVia("your email app"); }
  };

  const card = { background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 28 };
  const label = { fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 };
  const bad = key => (touched && !form[key].trim() ? { borderColor: "#c0392b" } : null);
  const pill = active => ({ padding: "8px 20px", borderRadius: 22, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", border: "2px solid " + (active ? B.coral : "#ddd"), background: active ? B.coral : "#fff", color: active ? "#fff" : "#555" });

  return (
    <div>
      <PageHero kicker="Work with us" title="Become a Peacock Paints distributor" subtitle="We are looking for businesses across East Africa who want to grow with a trusted, locally manufactured paint brand." gradient="linear-gradient(135deg, #5C2D6D, #8B4AAD)" />
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px 70px" }}>
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
          {STEPS.map(s => (
            <div key={s.n} style={{ ...card, padding: 22 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: B.coral, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, marginBottom: 12 }}>{s.n}</div>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>{s.t}</h3>
              <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6 }}>{s.d}</p>
            </div>
          ))}
        </div>

        <div style={{ ...card, maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 6 }}>Express your interest</h2>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Reference {reference}. This opens WhatsApp or your email app with your details ready to send.</p>

          <label style={label}>I am interested in becoming a</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {["Distributor", "Dealer"].map(k => <button key={k} style={pill(form.kind === k)} onClick={() => setForm(f => ({ ...f, kind: k }))}>{k}</button>)}
          </div>
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div><label style={label}>Business name *</label><input className="si" value={form.business} onChange={set("business")} style={bad("business")} /></div>
            <div><label style={label}>Contact person *</label><input className="si" value={form.person} onChange={set("person")} style={bad("person")} /></div>
            <div><label style={label}>Phone number *</label><input className="si" type="tel" value={form.phone} onChange={set("phone")} style={bad("phone")} /></div>
            <div><label style={label}>Email (optional)</label><input className="si" type="email" value={form.email} onChange={set("email")} /></div>
          </div>
          <div style={{ marginBottom: 14 }}><label style={label}>Town or district where you operate *</label><input className="si" value={form.location} onChange={set("location")} style={bad("location")} /></div>
          <div style={{ marginBottom: 16 }}><label style={label}>Business experience (optional)</label><textarea className="si" rows={3} value={form.experience} onChange={set("experience")} style={{ resize: "vertical" }} placeholder="Tell us about your shop, your customers and the products you sell." /></div>

          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, color: "#444", lineHeight: 1.6, cursor: "pointer", marginBottom: 6 }}>
            <input type="checkbox" checked={form.ack} onChange={e => setForm(f => ({ ...f, ack: e.target.checked }))} style={{ marginTop: 4, accentColor: B.coral }} />
            <span>I understand this is an expression of interest. Sending it does not make me a Peacock Paints dealer or distributor, and only authorised Peacock Paints staff can approve an application.</span>
          </label>
          <p style={{ fontSize: 12, color: "#999", marginBottom: 16 }}>Terms and conditions for dealers and distributors will be added here once approved by Peacock Paints management.</p>

          {touched && missing && <p style={{ fontSize: 13, color: "#c0392b", marginBottom: 12 }}>Please fill in the fields marked * and tick the box.</p>}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn bp" onClick={() => send("whatsapp")} disabled={!ready} style={{ flex: 1, justifyContent: "center", background: ready ? B.teal : "#ccc", cursor: ready ? "pointer" : "not-allowed" }}>Send on WhatsApp</button>
            <button className="btn bd" onClick={() => send("email")} style={{ flex: 1, justifyContent: "center" }}>Send by email</button>
          </div>
          {sentVia && <p style={{ fontSize: 13, marginTop: 16, padding: 14, background: "#eef7f4", borderRadius: 8, lineHeight: 1.6 }}>Your details are ready in {sentVia}. <strong>Press send there</strong> so they reach our team. Nothing has been sent until you do.</p>}
        </div>
      </section>
    </div>
  );
}
`,
  "src/pages/ProfessionalsPage.jsx": String.raw`import { useApp } from "../context/useApp.js";
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
    </div>
  );
}
`,
  "src/pages/ColourSystemsPage.jsx": String.raw`import { useApp } from "../context/useApp.js";
import { B } from "../data/theme.js";
import PageHero from "../components/common/PageHero.jsx";

const SYSTEMS = [
  { name: "Peacock Paints Colour Guide", text: "A curated palette developed with local preferences and modern trends in mind. It helps customers confidently select shades that suit both style requirements and long-term durability in real-world environments." },
  { name: "NCS - Natural Colour System", text: "For customers who require high precision and consistency, we offer colour matching using NCS. With over 2,000 clearly defined shades, NCS supports reliable specification for professional projects, ensuring harmony, accuracy and consistent results." },
  { name: "BS 4800 - British Standard Colour System", text: "Using the BS 4800 colour system, Peacock Paints provides a trusted selection of professional shades commonly specified for architectural and commercial applications. This system supports timeless colour choices, reliable colour matching and dependable performance on a wide range of substrates." },
  { name: "NOVA Colour System", text: "With the NOVA Colour System, Peacock Paints offers precise custom colours, from subtle interiors to bold statements, ensuring consistency and superior coverage." },
  { name: "RAL", text: "RAL is listed as a colour system on our products. Ask our team about matching a RAL colour for your project." },
];

export default function ColourSystemsPage() {
  const { nav, makeHref } = useApp();
  const go = (e, page) => { e.preventDefault(); nav(page); };
  return (
    <div>
      <PageHero kicker="Colours" title="Our colour systems" subtitle="Internationally recognised colour systems, matched in our own factory in Kampala." gradient="linear-gradient(135deg, #2d4a3e, #1a3a5c 50%, #5c2d6d)" />
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "50px 24px 30px" }}>
        {SYSTEMS.map(s => (
          <div key={s.name} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "22px 26px", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 8 }}>{s.name}</h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75 }}>{s.text}</p>
          </div>
        ))}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "28px 0 60px" }}>
          <a className="btn bp" href={makeHref("all-colours")} onClick={e => go(e, "all-colours")} style={{ textDecoration: "none" }}>Shop all colours</a>
          <a className="btn bd" href={makeHref("contact")} onClick={e => go(e, "contact")} style={{ textDecoration: "none" }}>Ask about colour matching</a>
        </div>
      </section>
    </div>
  );
}
`
};

const CSS_ADD = String.raw`
/* Floating pill navigation */
.ann-link { color: inherit; text-decoration: none; opacity: .88; transition: opacity .2s; }
.ann-link:hover { opacity: 1; text-decoration: underline; }
.pill-header { position: sticky; top: 12px; z-index: 200; padding: 0 16px; margin-top: 12px; }
.pill-bar { max-width: 1240px; margin: 0 auto; height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 12px 0 20px; border-radius: 40px; background: rgba(255,255,255,.72); -webkit-backdrop-filter: blur(16px) saturate(170%); backdrop-filter: blur(16px) saturate(170%); border: 1px solid rgba(255,255,255,.7); box-shadow: 0 8px 30px rgba(20,20,20,.10); transition: background .25s, box-shadow .25s; }
.pill-bar.pill-scrolled { background: rgba(255,255,255,.88); box-shadow: 0 10px 34px rgba(20,20,20,.16); }
.pill-logo img { height: 44px; display: block; }
.pill-nav { display: flex; gap: 2px; align-items: center; }
.pill-item { display: inline-flex; align-items: center; gap: 5px; padding: 9px 15px; border: none; background: transparent; border-radius: 24px; font: 500 13.5px 'Outfit', sans-serif; letter-spacing: .4px; text-transform: uppercase; color: #1a1a1a; cursor: pointer; transition: background .2s, color .2s; }
.pill-item:hover, .pill-item.is-open { background: rgba(232,96,60,.13); color: #C84A2A; }
.pill-item.is-current { background: #E8603C; color: #fff; }
.pill-item.is-current.is-open { background: #C84A2A; color: #fff; }
.pill-actions { display: flex; align-items: center; gap: 6px; }
.pill-icon { position: relative; width: 40px; height: 40px; border-radius: 50%; border: none; background: transparent; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: #1a1a1a; transition: background .2s; }
.pill-icon:hover { background: rgba(0,0,0,.06); }
.pill-badge { position: absolute; top: 1px; right: -1px; min-width: 18px; height: 18px; padding: 0 4px; border-radius: 9px; background: #E8603C; color: #fff; font-size: 10px; font-weight: 600; display: flex; align-items: center; justify-content: center; }
.pill-cta { margin-left: 4px; padding: 11px 22px; border: none; border-radius: 24px; background: #1a1a1a; color: #fff; font: 600 13px 'Outfit', sans-serif; letter-spacing: .4px; text-transform: uppercase; cursor: pointer; transition: background .2s; }
.pill-cta:hover { background: #E8603C; }
.pill-mega { position: absolute; left: 16px; right: 16px; top: calc(100% + 8px); max-width: 1240px; margin: 0 auto; border-radius: 28px; background: rgba(255,255,255,.94); -webkit-backdrop-filter: blur(18px) saturate(170%); backdrop-filter: blur(18px) saturate(170%); border: 1px solid rgba(255,255,255,.8); box-shadow: 0 20px 50px rgba(20,20,20,.16); animation: msd .25s ease; }
.pill-mega-inner { display: grid; gap: 32px; padding: 28px 32px; }
.pill-group-title { font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #E8603C; margin-bottom: 12px; }
.pill-link { display: flex; align-items: center; gap: 10px; padding: 7px 8px; margin: 0 -8px; border-radius: 10px; font-size: 14px; color: #444; cursor: pointer; text-decoration: none; transition: background .15s, color .15s; }
.pill-link:hover { background: #f3f1ee; color: #E8603C; }
.pill-footer-link { font-weight: 600; color: #E8603C; }
.pill-fam { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 8px; }
.pill-dot { width: 26px; height: 26px; border-radius: 50%; border: 2px solid rgba(0,0,0,.09); flex-shrink: 0; display: inline-block; }
.pill-cards { display: flex; flex-direction: column; gap: 12px; }
.pill-card { display: block; border-radius: 16px; padding: 18px 20px; text-decoration: none; cursor: pointer; transition: transform .25s; }
.pill-card:hover { transform: translateY(-2px); }
@media (max-width: 768px) { .pill-header { top: 8px; margin-top: 8px; padding: 0 10px; } .pill-bar { height: 56px; padding: 0 8px 0 16px; } .pill-logo img { height: 38px; } }
`;

// ["x", find, replacement]   exact text that must occur exactly once
// ["o", find, replacement]   same, but skipped (with a note) if the text is not found
// ["p", text]                add a line at the top of the file
const EDITS = {
  "src/config/contact.js": [
    ["x", 'salesEmail: "sales@peacock.co.ug",',
          'salesEmail: "sales@peacock.co.ug",\n  website: "www.peacock.co.ug",\n  address: "Plot 56, Sixth Street, Industrial Area, P.O Box 9549, Kampala, Uganda",\n  phones: ["+256-414-231721", "+256-700-159368"],'],
  ],
  "src/pages/PageSwitch.jsx": [
    ["p", 'import ContactPage from "./ContactPage.jsx";\nimport DistributorPage from "./DistributorPage.jsx";\nimport ProfessionalsPage from "./ProfessionalsPage.jsx";\nimport ColourSystemsPage from "./ColourSystemsPage.jsx";'],
    ["x", "      ) : CATEGORY_PAGES[pg] ? (",
          '      ) : pg === "contact" ? (\n        <ContactPage />\n      ) : pg === "distributor" ? (\n        <DistributorPage />\n      ) : pg === "professionals" ? (\n        <ProfessionalsPage />\n      ) : pg === "colour-systems" ? (\n        <ColourSystemsPage />\n      ) : CATEGORY_PAGES[pg] ? ('],
  ],
  "src/components/home/Hero.jsx": [
    ["x", "<div><strong>1962</strong><span>The Painters' Paint</span></div>", "<div><strong>1988</strong><span>Made in Uganda</span></div>"],
  ],
  "src/components/layout/QuoteModal.jsx": [
    ["x", "const { quoteOpen, setQuoteOpen, cart, setCart } = useApp();", "const { quoteOpen, setQuoteOpen, cart, setCart, nav } = useApp();"],
    ["x", '<p style={{ fontSize: 14, color: "#777", padding: "20px 0" }}>Your list is empty. Add products to your cart first, then request a quote.</p>',
          '<div style={{ padding: "12px 0 8px" }}>\n            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 16 }}>Your list is empty. Choose your products first, or work out how much you need, then request your quote.</p>\n            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>\n              <button className="btn bp" onClick={() => { setQuoteOpen(false); nav("decorative-paints"); }}>Browse products</button>\n              <button className="btn bd" onClick={() => { setQuoteOpen(false); nav("estimator"); }}>Paint estimator</button>\n            </div>\n          </div>'],
  ],
  "src/components/home/InfoCards.jsx": [
    ["o", 'd: "Find a Peacock stockist"', 'd: "Plot 56, Sixth Street, Industrial Area, Kampala"'],
    ["o", 'c: "Find store"', 'c: "Contact us"'],
  ],
};

const REPLACED = ["src/components/layout/Header.jsx", "src/components/layout/MobileMenu.jsx", "src/components/layout/AnnouncementBar.jsx", "src/components/layout/Footer.jsx", "src/data/navData.js", "src/data/storyPages.js"];

const problems = [];
const notes = [];
const contents = {};
for (const f of Object.keys(EDITS)) {
  if (!fs.existsSync(f)) { problems.push(`Missing ${f}`); continue; }
  contents[f] = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
}
for (const f of [...REPLACED, "src/styles/global.css", "src/data/colours.js"]) if (!fs.existsSync(f)) problems.push(`Missing ${f}`);
if (fs.existsSync("src/pages/ContactPage.jsx")) problems.push("src/pages/ContactPage.jsx already exists - this step looks done");

let count = 0;
for (const [f, edits] of Object.entries(EDITS)) {
  if (contents[f] === undefined) continue;
  for (const e of edits) {
    if (e[0] === "p") { contents[f] = e[1] + "\n" + contents[f]; count++; continue; }
    const n = contents[f].split(e[1]).length - 1;
    if (n === 0 && e[0] === "o") { notes.push(`skipped (text not found in ${f}): ${e[1]}`); continue; }
    if (n !== 1) { problems.push(`${f}: expected 1 match, found ${n} for: ${e[1].slice(0, 90)}`); continue; }
    contents[f] = contents[f].replace(e[1], () => e[2]); count++;
  }
}

let css = fs.existsSync("src/styles/global.css") ? fs.readFileSync("src/styles/global.css", "utf8").replace(/\r\n/g, "\n") : "";
if (css.includes(".pill-header")) problems.push("global.css already has the pill navigation styles");

const all = { ...contents, ...NEW_FILES };
try {
  const esbuild = createRequire(path.resolve("package.json"))("esbuild");
  for (const [f, c] of Object.entries(all)) {
    try { esbuild.transformSync(c, { loader: "jsx" }); } catch (e) { problems.push(`${f} would have a syntax error: ${String(e.message).split("\n")[0]}`); }
  }
} catch { console.log("(esbuild not found - skipped syntax check)"); }

if (problems.length) {
  console.error("\nStopped. Nothing was changed because of these problems:\n");
  problems.forEach(p => console.error("  - " + p));
  console.error("\nCopy this message and send it to Claude.");
  process.exit(1);
}
for (const [f, c] of Object.entries(all)) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, c, "utf8"); }
fs.writeFileSync("src/styles/global.css", css.replace(/\s*$/, "\n") + CSS_ADD, "utf8");

console.log(`\nDone. ${Object.keys(NEW_FILES).length} files written, ${count} edits applied.`);
console.log("\nReplaced: " + REPLACED.map(f => f.split("/").pop()).join(", "));
console.log("New pages: contact, distributor, professionals, colour-systems, vision, why-peacock (and a rewritten about)");
notes.forEach(n => console.log("Note: " + n));
console.log("\nTry it: npm run dev. Check the pill bar (hover and click each menu), the strip above it, Get a quote, the footer,");
console.log("and the Our Story, Contact, Professionals, Become a Distributor and Colour systems pages.");
console.log("Undo anytime with:  git checkout . ; git clean -fd src");
