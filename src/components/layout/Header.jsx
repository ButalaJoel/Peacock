import PaintBlob from "../common/PaintBlob.jsx";
import { useEffect, useState } from "react";
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
              onClick={() => { if (m.direct) { setActiveMenu(null); setPinned(null); nav(m.direct); return; } setPinned(pinned === i ? null : i); mE(i); }}>
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
                        <PaintBlob size={28} color={f.color} v={f.label.length} />
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
