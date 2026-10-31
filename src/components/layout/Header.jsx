import { LOGO_HEADER } from "../../data/images.js";
import { B } from "../../data/theme.js";
import { PRODUCTS } from "../../data/products.js";
import { navData } from "../../data/navData.js";
import { CAT_SWATCH_COLORS, COLOUR_CATEGORIES } from "../../data/colours.js";
import { CartIcon, SearchIcon, UserIcon, ChevDown, MenuIcon, Arr } from "../icons/Icons.jsx";
import { useApp } from "../../context/useApp.js";

export default function Header() {
  const { activeMenu, setActiveMenu, setMobMenu, setMobSub, setSearchOpen, scrolled, setPg, setProdTab, setFinishFilter, setSelectedProduct, setCartOpen, mRef, scrollToProdPending, mE, mL, nav, openProduct, makeHref, productHref, aReset, cartCount, handleMegaFooter } = useApp();
  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 200, background: "#fff", boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.08)" : "none", transition: "box-shadow .3s" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <button className="mob" onClick={() => setMobMenu(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><MenuIcon /></button>
          <a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center" }}><img src={LOGO_HEADER} alt="Peacock Paints" style={{ height: 52 }} /></a>
          <nav className="dsk" style={{ display: "flex", gap: 28, alignItems: "center" }} onMouseLeave={mL}>
            {navData.map((item, i) => (<div key={i} onMouseEnter={() => mE(i)}><span className={`nl ${activeMenu === i ? "a" : ""}`} style={{ display: "flex", alignItems: "center", gap: 4 }}>{item.label} <ChevDown /></span></div>))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><SearchIcon /></button>
            <button className="dsk" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><UserIcon /></button>
            <button onClick={() => setCartOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, position: "relative" }}><CartIcon />
              {cartCount > 0 && <span style={{ position: "absolute", top: -4, right: -6, background: B.coral, color: "#fff", fontSize: 10, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>{cartCount}</span>}
            </button>
          </div>
        </div>
        {activeMenu !== null && (
          <div className="mega dsk" onMouseEnter={() => clearTimeout(mRef.current)} onMouseLeave={mL}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: navData[activeMenu].columns.map(c => c.type === "promo" ? "1.2fr" : "1fr").join(" "), gap: 32 }}>
              {navData[activeMenu].columns.map((col, ci) => (<div key={ci}>
                {col.type === "promo" ? (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {col.items.map((pr, pi) => (<a key={pi} href={pr.page ? makeHref(pr.page) : undefined} onClick={e => { e.preventDefault(); if (pr.page) nav(pr.page); }} className="pc" style={{ ...aReset, display: "block", background: pr.bg, color: pr.dark ? "#fff" : "#1a1a1a" }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{pr.title}</h4>
                    <p style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 10, opacity: .85 }}>{pr.desc}</p>
                    <span style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>{pr.cta} <Arr /></span>
                  </a>))}</div>) : col.title === "By Colours" ? (<div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: B.coral, marginBottom: 14 }}>{col.title}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    {col.links.map((l, li) => {
                      const catData = COLOUR_CATEGORIES[l];
                      const isLinked = !!catData;
                      return (
                        <a key={li} href={isLinked ? makeHref(catData.slug) : undefined} onClick={e => { e.preventDefault(); if (isLinked) nav(catData.slug); }}
                          style={{ ...aReset, display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", borderRadius: 8, cursor: isLinked ? "pointer" : "default", transition: "background .18s" }}
                          onMouseEnter={e => { if (isLinked) e.currentTarget.style.background = "#f3f1ee"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: CAT_SWATCH_COLORS[l] || "#ddd", border: "2px solid rgba(0,0,0,.09)", flexShrink: 0, boxShadow: "inset 0 1px 2px rgba(255,255,255,.5)" }} />
                          <div>
                            <span style={{ fontSize: 13, color: isLinked ? "#2a2a2a" : "#aaa", fontWeight: isLinked ? 500 : 400, display: "block", lineHeight: 1.2 }}>{l}</span>
                            {isLinked && <span style={{ fontSize: 10, color: "#aaa" }}>{COLOUR_CATEGORIES[l].colors.length} shades</span>}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                  {col.footer && <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #e8e8e8" }}>{col.footer.map((f, fi) => (<button key={fi} className="ml" onClick={() => handleMegaFooter(f.label)} style={{ fontWeight: 600, color: B.coral, border: "none", background: "none", fontFamily: "inherit", width: "100%", textAlign: "left" }}>{f.label}</button>))}</div>}
                </div>) : (<div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: B.coral, marginBottom: 14 }}>{col.title}</h3>
                  {col.links.map((l, li) => {
                    const pageMap = {"Bedroom": "bedroom-inspiration", "Living Room": "livingroom-inspiration", "Dining Room": "diningroom-inspiration", "Kitchen": "kitchen-inspiration", "Bathroom": "bathroom-inspiration", "Whites": "whites-colour", "Creams": "creams-colour", "Neutrals": "neutrals-colour", "Pinks": "pinks-colour", "Yellows": "yellows-colour", "Greens": "greens-colour", "Blues": "blues-colour", "Greys": "greys-colour", "Metallics": "metallics-colour", "Contemporary": "contemporary-style", "Modern": "modern-style", "Boho": "boho-style", "Farmhouse": "farmhouse-style", "Scandi": "scandi-style", "Eclectic": "eclectic-style", "Interior Paints": "decorative-paints-interior", "Exterior Paints": "decorative-paints-exterior", "Primers": "decorative-paints-primers", "General Coatings": "industrial-coatings-general", "Waterproofing & Construction": "industrial-coatings-waterproofing", "Decorative Paints": "decorative-paints", "Industrial Coatings": "industrial-coatings", "Wood Care Paints": "wood-care-paints", "Thinners & Solvents": "thinners-solvents", "Paint Estimator": "estimator"};
                    const isFinishLink = col.title === "By Finish";
                    const isPageLink = !!pageMap[l];
                    const linkedProduct = PRODUCTS.find(p => p.name === l);
                    const isClickable = isFinishLink || isPageLink || !!linkedProduct;
                    const linkHref = isPageLink ? makeHref(pageMap[l]) : linkedProduct ? productHref(linkedProduct) : undefined;
                    return (<a key={li} href={linkHref} className="ml" onClick={e => {
                      e.preventDefault();
                      if (isFinishLink) { setFinishFilter(l); setProdTab("all"); setPg("home"); setSelectedProduct(null); setActiveMenu(null); setMobMenu(false); setMobSub(null); scrollToProdPending.current = true; }
                      else if (isPageLink) { nav(pageMap[l]); }
                      else if (linkedProduct) { openProduct(linkedProduct); }
                    }} style={{ ...aReset, cursor: isClickable ? "pointer" : "default", color: isFinishLink ? B.black : undefined }}>{l}</a>);
                  })}
                  {col.footer && <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #e8e8e8" }}>{col.footer.map((f, fi) => (<button key={fi} className="ml" onClick={() => handleMegaFooter(f.label)} style={{ fontWeight: 600, color: B.coral, border: "none", background: "none", fontFamily: "inherit", width: "100%", textAlign: "left" }}>{f.label}</button>))}</div>}
                </div>)}
              </div>))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
