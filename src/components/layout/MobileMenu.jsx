import PaintBlob from "../common/PaintBlob.jsx";
import { useApp } from "../../context/useApp.js";
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
                        <span style={{ display: "flex", alignItems: "center", gap: 10 }}><PaintBlob size={26} color={f.color} v={f.label.length} />{f.label}</span>
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
