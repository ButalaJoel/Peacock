import { LOGO_HEADER } from "../../data/images.js";
import { B } from "../../data/theme.js";
import { PRODUCTS } from "../../data/products.js";
import { navData } from "../../data/navData.js";
import { ChevRight, CloseIcon } from "../icons/Icons.jsx";
import { useApp } from "../../context/AppContext.jsx";

export default function MobileMenu() {
  const { setActiveMenu, mobMenu, setMobMenu, mobSub, setMobSub, setPg, setProdTab, setFinishFilter, setSelectedProduct, scrollToProdPending, nav, openProduct, makeHref, productHref, aReset } = useApp();
  return (
    <>
      {mobMenu && (<>
        <div className="mo" onClick={() => { setMobMenu(false); setMobSub(null); }} />
        <div className="md">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #eee" }}>
            {mobSub !== null ? (<><span style={{ fontWeight: 600 }}>{navData[mobSub].label}</span><button onClick={() => setMobSub(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: B.coral, fontWeight: 600 }}>Back</button></>) : (<><img src={LOGO_HEADER} alt="" style={{ height: 36 }} /><button onClick={() => { setMobMenu(false); setMobSub(null); }} style={{ background: "none", border: "none", cursor: "pointer" }}><CloseIcon /></button></>)}
          </div>
          {mobSub === null ? (<div>{navData.map((item, i) => (<div key={i} onClick={() => setMobSub(i)} style={{ padding: "14px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}><span style={{ fontWeight: 500 }}>{item.label}</span><ChevRight /></div>))}</div>) : (<div>
            {navData[mobSub].columns.filter(c => c.type !== "promo").map((col, ci) => (<div key={ci} style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: B.coral, marginBottom: 12 }}>{col.title}</h4>
              {col.links && col.links.map((l, li) => {
                const pageMap = {"Bedroom": "bedroom-inspiration", "Whites": "whites-colour", "Creams": "creams-colour", "Neutrals": "neutrals-colour", "Pinks": "pinks-colour", "Yellows": "yellows-colour", "Greens": "greens-colour", "Blues": "blues-colour", "Greys": "greys-colour", "Metallics": "metallics-colour"};
                const isFinishLink = col.title === "By Finish";
                const isPageLink = !!pageMap[l];
                const linkedProduct = PRODUCTS.find(p => p.name === l);
                const isClickable = isFinishLink || isPageLink || !!linkedProduct;
                const mobLinkHref = isPageLink ? makeHref(pageMap[l]) : linkedProduct ? productHref(linkedProduct) : undefined;
                return (<a key={li} href={mobLinkHref} onClick={e => {
                  e.preventDefault();
                  if (isFinishLink) { setFinishFilter(l); setProdTab("all"); setPg("home"); setSelectedProduct(null); setActiveMenu(null); setMobMenu(false); setMobSub(null); scrollToProdPending.current = true; }
                  else if (isPageLink) { nav(pageMap[l]); }
                  else if (linkedProduct) { openProduct(linkedProduct); }
                }} style={{ ...aReset, padding: "8px 0", fontSize: 14, color: isClickable ? B.coral : "#444", cursor: isClickable ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {l}{isClickable && !isFinishLink && <ChevRight />}
                </a>);
              })}
            </div>))}
          </div>)}
        </div>
      </>)}
    </>
  );
}
