import { useState, useEffect, useRef } from "react";
import { LOGO_HEADER, LOGO_FOOTER, IMG_WEATHER, INSPO_SCANDI_SAGE, INSPO_LR_PALE_BEIGE, INSPO_KT_CREAM } from "./data/images.js";
import { B } from "./data/theme.js";
import { PRODUCTS, SAMPLE_POT, SAMPLE_BUNDLE } from "./data/products.js";
import { storyPages } from "./data/storyPages.js";
import { navData } from "./data/navData.js";
import { trendingColours, CAT_SWATCH_COLORS, COLOUR_CATEGORIES, STYLE_CATEGORIES } from "./data/colours.js";
import { BEDROOM_INSPIRATIONS, LIVING_ROOM_INSPIRATIONS, DINING_ROOM_INSPIRATIONS, KITCHEN_INSPIRATIONS, BATHROOM_INSPIRATIONS } from "./data/inspirations.js";
import { CartIcon, SearchIcon, UserIcon, ChevDown, ChevRight, MenuIcon, CloseIcon, Arr, ArrL, PhoneIcon, MailIcon, TruckIcon, PaletteIcon, HeartIcon, GlobeIcon, UsersIcon, LeafIcon } from "./components/icons/Icons.jsx";
import PaintBlob from "./components/common/PaintBlob.jsx";
import "./styles/global.css";
import PaintCategoryPage from "./pages/PaintCategoryPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import RoomInspirationPage from "./pages/RoomInspirationPage.jsx";
import ColourCategoryPage from "./pages/ColourCategoryPage.jsx";
import StyleCategoryPage from "./pages/StyleCategoryPage.jsx";
import ColourDetailPage from "./pages/ColourDetailPage.jsx";

// ═══════ MAIN APP ═══════
export default function PeacockPaintsWebsite() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobMenu, setMobMenu] = useState(false);
  const [mobSub, setMobSub] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pg, setPg] = useState("home");
  const [prodTab, setProdTab] = useState("all");
  const [finishFilter, setFinishFilter] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedColour, setSelectedColour] = useState(null);
  const [selectedColourCategory, setSelectedColourCategory] = useState(null);
  const [selectedColourStyle, setSelectedColourStyle] = useState(null);
  const [colourCarouselIdx, setColourCarouselIdx] = useState(0);
  const CARDS_VISIBLE = 5;
  const findColourCat = (name) => { for (const [k, v] of Object.entries(COLOUR_CATEGORIES)) { if (v.colors.includes(name)) return k; } return null; };
  const handleColourClick = (c) => { const cat = findColourCat(c.name); setSelectedColour(c); setSelectedColourCategory(cat); setPg("colour-detail"); setActiveMenu(null); setMobMenu(false); setMobSub(null); window.scrollTo({ top: 0, behavior: "smooth" }); window.history.replaceState(null, "", `#/colour/${encodeURIComponent(c.name)}`); };
  const mRef = useRef(null);
  const prodSectionRef = useRef(null);
  const scrollToProdPending = useRef(false);

  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => {
    if (heroPaused) return undefined;
    const t = setInterval(() => setHeroSlide(s => (s + 1) % 3), 6500);
    return () => clearInterval(t);
  }, [heroPaused]);

  // ─── Hash-based routing: restore page from URL on mount / new tab ───
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, "");
      if (!hash || hash === "home") { setPg("home"); return; }
      if (hash.startsWith("product/")) {
        const id = hash.replace("product/", "");
        const p = PRODUCTS.find(pr => pr.id === id);
        if (p) { setSelectedProduct(p); setPg("product"); return; }
      }
      if (hash.startsWith("colour/")) {
        const name = decodeURIComponent(hash.replace("colour/", ""));
        const c = trendingColours.find(tc => tc.name === name);
        if (c) { const cat = findColourCat(c.name); setSelectedColour(c); setSelectedColourCategory(cat); setPg("colour-detail"); return; }
      }
      setPg(hash);
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);
  useEffect(() => {
    if (scrollToProdPending.current && prodSectionRef.current) {
      scrollToProdPending.current = false;
      const t = setTimeout(() => prodSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      return () => clearTimeout(t);
    }
  }, [finishFilter]);

  const mE = i => { clearTimeout(mRef.current); setActiveMenu(i); };
  const mL = () => { mRef.current = setTimeout(() => setActiveMenu(null), 200); };
  const nav = p => { setPg(p); setSelectedProduct(null); setActiveMenu(null); setMobMenu(false); setMobSub(null); window.scrollTo({ top: 0, behavior: "smooth" }); window.history.replaceState(null, "", `#/${p}`); };
  const openProduct = (p) => { setSelectedProduct(p); setPg("product"); setActiveMenu(null); setMobMenu(false); setMobSub(null); window.scrollTo({ top: 0, behavior: "smooth" }); window.history.replaceState(null, "", `#/product/${p.id}`); };

  // ─── Hash URL helpers ───
  const makeHref = (slug) => `#/${slug}`;
  const productHref = (p) => `#/product/${p.id}`;
  const colourHref = (c) => `#/colour/${encodeURIComponent(c.name)}`;
  const aReset = { textDecoration: "none", color: "inherit" };
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === item.product.id && c.size === item.size && (c.colour || null) === (item.colour || null));
      if (existing) return prev.map(c => c.product.id === item.product.id && c.size === item.size && (c.colour || null) === (item.colour || null) ? { ...c, qty: c.qty + item.qty } : c);
      return [...prev, item];
    });
  };
  const addSamplePot = (colourName) => {
    addToCart({ product: SAMPLE_POT, size: "100ml", price: 3000, qty: 1, colour: colourName });
    setCartOpen(true);
  };
  const addSampleBundle = () => {
    addToCart({ product: SAMPLE_BUNDLE, size: "5 pots", price: 15000, qty: 1, colour: null });
    setCartOpen(true);
  };
  const removeFromCart = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));
  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const fmtP = p => `UGX ${p.toLocaleString()}`;
  const weathershield = PRODUCTS.find(p => p.id === "weathershield");
  const iconFor = s => ({ globe: <GlobeIcon/>, heart: <HeartIcon/>, palette: <PaletteIcon/>, users: <UsersIcon/>, leaf: <LeafIcon/>, truck: <TruckIcon/> }[s] || <PaletteIcon/>);

  const heroSlides = [
    {
      eyebrow: "New colour studio",
      title: "Paint your next room before the first brush stroke.",
      copy: "Compare Peacock shades, finishes, and real products in one warm studio built for homes, schools, shops, and site teams.",
      accent: "#ff4d8b",
      roomImg: INSPO_SCANDI_SAGE,
      swatches: [
        { name: "Rose", color: "#CC7B8C" },
        { name: "Balm", color: "#CADCCB" },
        { name: "Medallion", color: "#C49820" },
        { name: "Denim", color: "#1E3A68" },
      ],
      note: "Interior walls",
      cta2: "Explore colours",
      cta2Page: "colours",
    },
    {
      eyebrow: "Colour at home",
      title: "Give living rooms colour that holds its nerve.",
      copy: "Warm neutrals, rich masonry tones, and practical coverage details help every interior feel deliberate.",
      accent: "#1a3a3a",
      roomImg: INSPO_LR_PALE_BEIGE,
      swatches: [
        { name: "Lake Green", color: "#BFCA9E" },
        { name: "Tandoori", color: "#8E3020" },
        { name: "Cool Blue", color: "#A8C6D6" },
        { name: "Havana", color: "#3E5030" },
      ],
      note: "Living room",
      cta2: "Explore colours",
      cta2Page: "colours",
    },
    {
      eyebrow: "Specialist finishes",
      title: "From polished walls to tough workshop floors.",
      copy: "Browse coatings for wood, vehicles, decorative walls, and industrial surfaces with the same colour-first energy.",
      accent: "#b8a4ed",
      roomImg: INSPO_KT_CREAM,
      swatches: [
        { name: "Violet Bouquet", color: "#C0A0C8" },
        { name: "Copper", color: "#AD6040" },
        { name: "Pearl", color: "#EEE7C5" },
        { name: "Signal Blue", color: "#2848A0" },
      ],
      note: "Specialist systems",
      cta2: "Specialist finishes",
      cta2Page: "specialist",
    },
  ];
  const currentHero = heroSlides[heroSlide] || heroSlides[0];
  const openHeroProductGrid = (tab = "all") => {
    setPg("home");
    setSelectedProduct(null);
    setProdTab(tab);
    setFinishFilter(null);
    setActiveMenu(null);
    setMobMenu(false);
    setMobSub(null);
    setTimeout(() => prodSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };
  const shopHeroProducts = () => openHeroProductGrid("all");
  const exploreHero = () => {
    if (currentHero.cta2Page === "colours") { nav("all-colours"); return; }
    if (currentHero.cta2Page === "specialist") { openHeroProductGrid("specialist"); return; }
    nav(currentHero.cta2Page);
  };
  const showHeroSlide = (idx) => setHeroSlide((idx + heroSlides.length) % heroSlides.length);
  const openHeroSwatch = (swatch) => {
    const match = trendingColours.find(c => c.name === swatch.name);
    if (match) handleColourClick(match);
  };
  const handleMegaFooter = (label) => {
    if (label === "Shop all colours") nav("all-colours");
    if (label === "All interior paints") nav("interior-paint");
    if (label === "All exterior paints") nav("exterior-paint");
    if (label === "All specialist paints") openHeroProductGrid("specialist");
    if (label === "Get inspired") nav("bedroom-inspiration");
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const catOk = prodTab === "all" || p.category === prodTab;
    const finishOk = !finishFilter || p.finish.toLowerCase().includes(finishFilter.toLowerCase());
    return catOk && finishOk;
  });

  const currentColourCatName = Object.keys(COLOUR_CATEGORIES).find(k => COLOUR_CATEGORIES[k].slug === pg) || null;
  const currentStyleName = Object.keys(STYLE_CATEGORIES).find(k => STYLE_CATEGORIES[k].slug === pg) || null;

  const renderStory = key => {
    const p = storyPages[key]; if (!p) return null;
    return (<div>
      <section style={{ background: p.hg, padding: "80px 0 60px", color: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, marginBottom: 16, opacity: .8 }}>Our Story</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, marginBottom: 16 }}>{p.title}</h1>
          <p style={{ fontSize: 20, opacity: .9, fontWeight: 300 }}>{p.subtitle}</p>
        </div>
      </section>
      <section style={{ background: "#1a1a1a", color: "#fff", padding: "32px 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: `repeat(${p.stats.length}, 1fr)`, gap: 24, textAlign: "center" }}>
          {p.stats.map((s, i) => (<div key={i}><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: B.coral }}>{s.n}</div><div style={{ fontSize: 13, opacity: .7, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div></div>))}
        </div>
      </section>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        {p.sections.map((s, i) => (<div key={i} style={{ marginBottom: 56, paddingBottom: i < p.sections.length - 1 ? 56 : 0, borderBottom: i < p.sections.length - 1 ? "1px solid #e8e4de" : "none" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${B.coral}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: B.coral }}>{iconFor(s.i)}</div>
            <div><h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 16 }}>{s.t}</h2>
              {s.c.split("\n\n").map((para, pi) => (<p key={pi} style={{ fontSize: 15, lineHeight: 1.85, color: "#555", marginBottom: 16 }}>{para}</p>))}
            </div></div></div>))}
      </section>
      <section style={{ background: B.warm, padding: "60px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, textAlign: "center", marginBottom: 36 }}>Explore More</h2>
          <div className="ge4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {Object.entries(storyPages).filter(([k]) => k !== key).map(([k, s]) => (
              <a key={k} href={makeHref(k)} onClick={e => { e.preventDefault(); nav(k); }} style={{ ...aReset, background: s.hg, borderRadius: 12, padding: 28, color: "#fff", cursor: "pointer", transition: "transform .3s", minHeight: 140, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{s.title}</h3><p style={{ fontSize: 12, opacity: .85 }}>{s.subtitle}</p>
              </a>))}
          </div>
        </div>
      </section>
    </div>);
  };

  return (
    <div style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif", color: "#1a1a1a", background: "#fff", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Top Bar */}
      <div style={{ background: B.black, color: "#fff", fontSize: 13, padding: "8px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><TruckIcon /> Free delivery over UGX 200,000</span><button onClick={addSampleBundle} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "inherit", font: "inherit", cursor: "pointer" }}><PaletteIcon /> 5 colour samples for UGX 15,000</button></div>
          <div className="dsk" style={{ display: "flex", gap: 20, fontSize: 12 }}><span style={{ cursor: "pointer" }}>Stockists</span><span style={{ cursor: "pointer" }}>Contact Us</span><span style={{ cursor: "pointer" }}>Professionals</span></div>
        </div>
      </div>

      {/* Header */}
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
                    const pageMap = {"Bedroom": "bedroom-inspiration", "Living Room": "livingroom-inspiration", "Dining Room": "diningroom-inspiration", "Kitchen": "kitchen-inspiration", "Bathroom": "bathroom-inspiration", "Whites": "whites-colour", "Creams": "creams-colour", "Neutrals": "neutrals-colour", "Pinks": "pinks-colour", "Yellows": "yellows-colour", "Greens": "greens-colour", "Blues": "blues-colour", "Greys": "greys-colour", "Metallics": "metallics-colour", "Contemporary": "contemporary-style", "Modern": "modern-style", "Boho": "boho-style", "Farmhouse": "farmhouse-style", "Scandi": "scandi-style", "Eclectic": "eclectic-style", "Interior Paint": "interior-paint", "Exterior Paint": "exterior-paint"};
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

      {/* Search */}
      {searchOpen && (<div className="so" onClick={() => setSearchOpen(false)}><div style={{ background: "#fff", borderRadius: 8, padding: 32, width: 600, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h3 style={{ fontSize: 18, fontWeight: 600 }}>Search</h3><button onClick={() => setSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><CloseIcon /></button></div>
        <input className="si" placeholder="Search colours, paints, inspiration..." autoFocus />
      </div></div>)}

      {/* Cart Drawer */}
      {cartOpen && (<>
        <div className="mo" onClick={() => setCartOpen(false)} />
        <div className="cart-drawer">
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>Your Cart ({cartCount})</h3>
            <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><CloseIcon /></button>
          </div>
          {cart.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: .3 }}>🛒</div>
              <p style={{ fontSize: 15, color: "#999" }}>Your cart is empty</p>
              <button onClick={() => setCartOpen(false)} className="btn bp" style={{ marginTop: 20 }}>Continue Shopping</button>
            </div>
          ) : (<>
            <div style={{ padding: "16px 24px", flex: 1 }}>
              {cart.map((item, i) => {
                const colourData = item.colour ? trendingColours.find(c => c.name === item.colour) : null;
                return (
                <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ width: 64, height: 64, background: B.off, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                    {item.product.img ? <img src={item.product.img} alt="" style={{ maxHeight: 54, maxWidth: 54, objectFit: "contain" }} /> : <div style={{ width: 48, height: 48, borderRadius: 8, background: colourData?.color || B.coral, border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,.12)" }} />}
                    {colourData && <div style={{ position: "absolute", bottom: -4, right: -4, width: 22, height: 22, borderRadius: "50%", background: colourData.color, border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.product.name}</h4>
                    {item.colour && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        {colourData && <div style={{ width: 14, height: 14, borderRadius: "50%", background: colourData.color, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />}
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>{item.colour}</span>
                      </div>
                    )}
                    <p style={{ fontSize: 12, color: "#999" }}>{item.size} × {item.qty}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: B.coral, marginTop: 4 }}>{fmtP(item.price * item.qty)}</p>
                  </div>
                  <button onClick={() => removeFromCart(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 18, alignSelf: "flex-start" }}>×</button>
                </div>
              );})}
            </div>
            <div style={{ padding: "20px 24px", borderTop: "2px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: B.coral }}>{fmtP(cartTotal)}</span>
              </div>
              {cartTotal >= 200000 && <p style={{ fontSize: 13, color: B.teal, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><TruckIcon /> Free delivery included!</p>}
              <button className="btn bp" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15 }}>Proceed to Checkout</button>
            </div>
          </>)}
        </div>
      </>)}

      {/* Mobile Menu */}
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

      {/* ═══ PAGES ═══ */}
      {pg === "interior-paint" ? (
        <PaintCategoryPage category="interior" title="Interior Paints" subtitle="Premium interior paints for every room — from smooth matts to washable silks and high-gloss finishes." onOpenProduct={openProduct} productHrefFn={productHref} homeHref={makeHref("home")} nav={nav} />
      ) : pg === "exterior-paint" ? (
        <PaintCategoryPage category="exterior" title="Exterior Paints" subtitle="Durable exterior coatings engineered for East Africa's climate — protecting and beautifying your building for years." onOpenProduct={openProduct} productHrefFn={productHref} homeHref={makeHref("home")} nav={nav} />
      ) : pg === "product" && selectedProduct ? (
        <ProductDetailPage product={selectedProduct} onBack={() => nav("home")} onAddToCart={addToCart} onOpenProduct={openProduct} />
      ) : pg === "bedroom-inspiration" ? (
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div>
        <RoomInspirationPage roomName="Bedroom" inspirations={BEDROOM_INSPIRATIONS} onBack={() => nav("home")} nav={nav} onAddSample={addSamplePot} onAddSampleBundle={addSampleBundle} /></>
      ) : pg === "livingroom-inspiration" ? (
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div>
        <RoomInspirationPage roomName="Living Room" inspirations={LIVING_ROOM_INSPIRATIONS} onBack={() => nav("home")} nav={nav} onAddSample={addSamplePot} onAddSampleBundle={addSampleBundle} /></>
      ) : pg === "diningroom-inspiration" ? (
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div>
        <RoomInspirationPage roomName="Dining Room" inspirations={DINING_ROOM_INSPIRATIONS} onBack={() => nav("home")} nav={nav} onAddSample={addSamplePot} onAddSampleBundle={addSampleBundle} /></>
      ) : pg === "kitchen-inspiration" ? (
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div>
        <RoomInspirationPage roomName="Kitchen" inspirations={KITCHEN_INSPIRATIONS} onBack={() => nav("home")} nav={nav} onAddSample={addSamplePot} onAddSampleBundle={addSampleBundle} /></>
      ) : pg === "bathroom-inspiration" ? (
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div>
        <RoomInspirationPage roomName="Bathroom" inspirations={BATHROOM_INSPIRATIONS} onBack={() => nav("home")} nav={nav} onAddSample={addSamplePot} onAddSampleBundle={addSampleBundle} /></>
      ) : pg === "colour-detail" && selectedColour ? (
        <ColourDetailPage
          colour={selectedColour}
          categoryName={selectedColourCategory || selectedColourStyle}
          onBack={() => {
            const d = COLOUR_CATEGORIES[selectedColourCategory];
            if (d) { nav(d.slug); return; }
            const s = STYLE_CATEGORIES[selectedColourStyle];
            if (s) { nav(s.slug); return; }
            nav("home");
          }}
          onBackHome={() => nav("home")}
          onAddToCart={addToCart}
          onAddSample={addSamplePot}
          homeHref={makeHref("home")}
          backHref={(() => { const d = COLOUR_CATEGORIES[selectedColourCategory]; if (d) return makeHref(d.slug); const s = STYLE_CATEGORIES[selectedColourStyle]; if (s) return makeHref(s.slug); return makeHref("home"); })()}
        />
      ) : pg === "all-colours" ? (
        <ColourCategoryPage
          categoryName="colours"
          categoryData={{ slug: "all-colours", desc: "Every Peacock shade in one place.", colors: trendingColours.map(c => c.name), gradient: "linear-gradient(135deg, #fffaf0, #f3e7d3)", accent: B.coral }}
          allColours={trendingColours}
          onBack={() => nav("home")}
          onNavCategory={(name) => { const d = COLOUR_CATEGORIES[name]; if (d) nav(d.slug); }}
          onOpenColour={handleColourClick}
          onAddSample={addSamplePot}
          onAddSampleBundle={addSampleBundle}
          onViewAllColours={() => nav("all-colours")}
          homeHref={makeHref("home")}
          colourHrefFn={colourHref}
          catHrefFn={(name, data) => makeHref(data.slug)}
        />
      ) : currentColourCatName ? (
        <ColourCategoryPage
          categoryName={currentColourCatName}
          categoryData={COLOUR_CATEGORIES[currentColourCatName]}
          allColours={trendingColours}
          onBack={() => nav("home")}
          onNavCategory={(name) => { const d = COLOUR_CATEGORIES[name]; if (d) nav(d.slug); }}
          onOpenColour={(c) => { setSelectedColour(c); setSelectedColourCategory(currentColourCatName); nav("colour-detail"); }}
          onAddSample={addSamplePot}
          onAddSampleBundle={addSampleBundle}
          onViewAllColours={() => nav("all-colours")}
          homeHref={makeHref("home")}
          colourHrefFn={colourHref}
          catHrefFn={(name, data) => makeHref(data.slug)}
        />
      ) : currentStyleName ? (
        <StyleCategoryPage
          styleName={currentStyleName}
          styleData={STYLE_CATEGORIES[currentStyleName]}
          allColours={trendingColours}
          onBack={() => nav("home")}
          onNavStyle={(name) => { const d = STYLE_CATEGORIES[name]; if (d) nav(d.slug); }}
          onOpenColour={(c) => { setSelectedColour(c); setSelectedColourStyle(currentStyleName); setSelectedColourCategory(null); nav("colour-detail"); }}
          onAddSample={addSamplePot}
          onAddSampleBundle={addSampleBundle}
          onViewAllColours={() => nav("all-colours")}
          homeHref={makeHref("home")}
          colourHrefFn={colourHref}
          styleHrefFn={(name, data) => makeHref(data.slug)}
        />
      ) : pg !== "home" && storyPages[pg] ? (
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div>{renderStory(pg)}</>
      ) : (<>
        {/* Hero */}
        <section
          className="paint-hero"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
          onFocus={() => setHeroPaused(true)}
          onBlur={() => setHeroPaused(false)}
          style={{ "--hero-accent": currentHero.accent }}
        >
          <div className="paint-hero-shell">
            <div className="paint-hero-copy">
              <div className="paint-hero-kicker"><span />{currentHero.eyebrow}</div>
              <h1 className="paint-hero-title">{currentHero.title}</h1>
              <p>{currentHero.copy}</p>
              <div className="paint-hero-actions">
                <button className="paint-hero-action" onClick={shopHeroProducts}>Shop paints <Arr /></button>
                <button className="paint-hero-action secondary" onClick={exploreHero}>{currentHero.cta2} <Arr /></button>
              </div>
              <div className="paint-hero-proof" aria-label="Peacock Paints highlights">
                <div><strong>1962</strong><span>The Painters' Paint</span></div>
                <div><strong>{trendingColours.length}</strong><span>colour shades</span></div>
                <div><strong>5</strong><span>sample pots bundle</span></div>
              </div>
            </div>

            <div className="paint-hero-visual" aria-label={`${currentHero.note} room inspiration`}>
              <img className="paint-hero-room" src={currentHero.roomImg} alt={`${currentHero.note} painted with Peacock colours`} />
              <div className="paint-hero-swatches">
                {currentHero.swatches.map(s => (
                  <button key={s.name} className="paint-hero-swatch" title={s.name} aria-label={`View ${s.name} colour`} onClick={() => openHeroSwatch(s)} style={{ background: s.color }} />
                ))}
              </div>
            </div>
          </div>

          <div className="paint-hero-switcher">
            <button className="paint-hero-nav" onClick={() => showHeroSlide(heroSlide - 1)} aria-label="Previous hero slide"><ArrL /></button>
            {heroSlides.map((sl, i) => (
              <button key={sl.eyebrow} className={`paint-hero-dot ${heroSlide === i ? "active" : ""}`} onClick={() => showHeroSlide(i)} aria-label={`Show ${sl.eyebrow}`} />
            ))}
            <button className="paint-hero-nav" onClick={() => showHeroSlide(heroSlide + 1)} aria-label="Next hero slide"><Arr /></button>
          </div>
        </section>

        <section className="doors" aria-label="Shop for the home or for site teams">
          <div className="doors-grid">
            <button className="doors-home" onClick={() => nav("bedroom-inspiration")}>
              <img src={INSPO_SCANDI_SAGE} alt="Sage bedroom with a wood bed, linen, and morning light" />
              <span className="doors-home-shade" aria-hidden="true" />
              <span className="doors-home-copy">
                <strong>For the home.</strong>
                <span>Find interior paints and colours that work with the light in every room.</span>
              </span>
            </button>
            <div className="doors-side">
              <button className="doors-trade" onClick={() => nav("exterior-paint")}>
                <span>
                  <strong>For site teams.</strong>
                  <span className="doors-trade-copy">Specify exterior, industrial, and trade finishes built for the job.</span>
                </span>
                <span className="doors-trade-go">Exterior paints <Arr /></span>
              </button>
              <button className="doors-tin" onClick={() => openProduct(weathershield)}>
                <img src={IMG_WEATHER} alt="" />
                <span>
                  <strong>Weathershield</strong>
                  <span>Grade 1 exterior matt. From {fmtP(weathershield.sizes[0].price)}</span>
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Trending Colours */}
        <section style={{ background: B.off, padding: "60px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <h2 className="st">Our trending colours</h2>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button className="btn bd dsk" onClick={() => nav("all-colours")}>Shop all colours</button>
                {/* Prev arrow */}
                <button
                  onClick={() => setColourCarouselIdx(i => Math.max(0, i - 1))}
                  disabled={colourCarouselIdx === 0}
                  style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #ddd", background: colourCarouselIdx === 0 ? "#f5f5f5" : "#fff", cursor: colourCarouselIdx === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: colourCarouselIdx === 0 ? "#ccc" : "#333", transition: "all .2s", flexShrink: 0 }}>
                  <ArrL />
                </button>
                {/* Next arrow */}
                <button
                  onClick={() => setColourCarouselIdx(i => Math.min(trendingColours.length - CARDS_VISIBLE, i + 1))}
                  disabled={colourCarouselIdx >= trendingColours.length - CARDS_VISIBLE}
                  style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #1a1a1a", background: colourCarouselIdx >= trendingColours.length - CARDS_VISIBLE ? "#f5f5f5" : "#1a1a1a", cursor: colourCarouselIdx >= trendingColours.length - CARDS_VISIBLE ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: colourCarouselIdx >= trendingColours.length - CARDS_VISIBLE ? "#ccc" : "#fff", transition: "all .2s", flexShrink: 0 }}>
                  <Arr />
                </button>
              </div>
            </div>
            {/* Cards grid — 5 visible */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
              {trendingColours.slice(colourCarouselIdx, colourCarouselIdx + CARDS_VISIBLE).map((c, i) => (
                <a key={colourCarouselIdx + i} href={colourHref(c)}
                  onClick={e => { e.preventDefault(); handleColourClick(c); }}
                  style={{ ...aReset, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "transform .3s, box-shadow .3s", display: "flex", flexDirection: "column", background: c.color }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-7px)"; e.currentTarget.style.boxShadow = "0 24px 52px rgba(0,0,0,.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  {/* Swatch area */}
                  <div style={{ padding: "28px 20px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "80%", aspectRatio: "1 / 1", filter: "drop-shadow(0 8px 20px rgba(0,0,0,.22))" }}>
                      <PaintBlob color={c.color} v={i} />
                    </div>
                  </div>
                  {/* Info bar */}
                  <div style={{ padding: "14px 16px 16px", background: "rgba(0,0,0,.18)" }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2, textShadow: "0 1px 4px rgba(0,0,0,.3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}®</h4>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,.75)", marginBottom: 12, lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.desc}</p>
                    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                      <button onClick={e => { e.stopPropagation(); e.preventDefault(); handleColourClick(c); }} style={{ flex: 1, padding: "7px 0", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", letterSpacing: .3 }}>Shop</button>
                      <button onClick={e => { e.stopPropagation(); e.preventDefault(); addSamplePot(c.name); }} style={{ flex: 1, padding: "7px 0", background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.65)", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>+ Sample</button>
                      <button onClick={e => { e.stopPropagation(); e.preventDefault(); handleColourClick(c); }} style={{ width: 30, height: 30, background: "rgba(255,255,255,.2)", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}><Arr /></button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            {/* Progress indicator */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 24 }}>
              {Array.from({ length: Math.ceil(trendingColours.length / CARDS_VISIBLE) }).map((_, i) => {
                const isActive = Math.floor(colourCarouselIdx / CARDS_VISIBLE) === i;
                return <button key={i} onClick={() => setColourCarouselIdx(i * CARDS_VISIBLE)} style={{ width: isActive ? 24 : 8, height: 8, borderRadius: 4, background: isActive ? "#1a1a1a" : "#ccc", border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }} />;
              })}
            </div>
          </div>
        </section>

        {/* ═══ FULL PRODUCT CATALOGUE ═══ */}
        <section ref={prodSectionRef} style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ marginBottom: 32 }}>
            <h2 className="st" style={{ marginBottom: 8 }}>Our complete product range</h2>
            <p style={{ fontSize: 15, color: "#666" }}>Click any product for full details, size options, and ordering</p>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: finishFilter ? 16 : 32, flexWrap: "wrap" }}>
            {[{ k: "all", l: `All (${PRODUCTS.length})` },{ k: "interior", l: `Interior (${PRODUCTS.filter(p=>p.category==="interior").length})` },{ k: "exterior", l: `Exterior (${PRODUCTS.filter(p=>p.category==="exterior").length})` },{ k: "specialist", l: `Specialist (${PRODUCTS.filter(p=>p.category==="specialist").length})` }].map(t => (
              <button key={t.k} className={`tab ${prodTab === t.k ? "ta" : "ti"}`} onClick={() => { setProdTab(t.k); setFinishFilter(null); }}>{t.l}</button>
            ))}
          </div>
          {finishFilter && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <span style={{ fontSize: 13, color: "#888" }}>Filtered by finish:</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: B.coral, color: "#fff", padding: "6px 14px 6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                {finishFilter}
                <span onClick={() => setFinishFilter(null)} style={{ cursor: "pointer", fontSize: 16, lineHeight: 1, opacity: .85, marginLeft: 2 }} title="Clear filter">×</span>
              </span>
              <span style={{ fontSize: 13, color: "#aaa" }}>({filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""})</span>
            </div>
          )}
          <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {filteredProducts.map(p => (
              <a key={p.id} href={productHref(p)} onClick={e => { e.preventDefault(); openProduct(p); }} style={{ ...aReset, display: "block", background: "#fff", borderRadius: 12, border: "1px solid #eee", overflow: "hidden", cursor: "pointer", transition: "transform .3s, box-shadow .3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.1)"; }} onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                <div style={{ background: B.off, padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "center", height: 200, position: "relative" }}>
                  {p.img && <img src={p.img} alt={p.name} style={{ maxHeight: 170, maxWidth: "80%", objectFit: "contain", filter: "drop-shadow(0 6px 12px rgba(0,0,0,.12))" }} />}
                  {p.tag && <span style={{ position: "absolute", top: 10, left: 10, background: p.tag === "Best Seller" ? B.coral : p.tag === "New" ? B.teal : p.tag === "Specialist" ? B.gold : "#5C2D6D", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>{p.tag}</span>}
                  {p.grade && <span style={{ position: "absolute", top: 10, right: 10, background: "#fff", border: `2px solid ${B.coral}`, color: B.coral, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>G{p.grade}</span>}
                </div>
                <div style={{ padding: "16px 18px 18px" }}>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{p.name}</h4>
                  <p style={{ fontSize: 12, color: "#777", lineHeight: 1.4, marginBottom: 10, minHeight: 34 }}>{p.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: B.coral }}>From {fmtP(p.sizes[0].price)}</span>
                    <span style={{ fontSize: 12, color: "#999" }}>{p.sizes.map(s => s.size).join(" • ")}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section style={{ background: `linear-gradient(135deg, ${B.coral}, ${B.coralDk})`, padding: "60px 0" }}>
          <div className="g2" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div style={{ color: "#fff" }}><h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 600, marginBottom: 12 }}>Inspiration in your inbox</h2><p style={{ fontSize: 15, opacity: .9, lineHeight: 1.6 }}>Latest colour trends + 10% off your first purchase</p></div>
            <div style={{ display: "flex", gap: 12 }}><input type="email" placeholder="Email Address" style={{ flex: 1, padding: "14px 18px", borderRadius: 6, border: "none", fontSize: 15, fontFamily: "'Outfit',sans-serif", outline: "none" }} /><button className="btn" style={{ background: B.black, color: "#fff" }}>Sign Up</button></div>
          </div>
        </section>

        {/* Info Cards */}
        <section style={{ background: B.off, padding: "60px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <h2 className="st" style={{ marginBottom: 36 }}>We're here for you</h2>
            <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {[{ t: "Inspiration", d: "Design trends for 2026", c: "Discover", bg: `linear-gradient(135deg,${B.teal}90,${B.tealDk})` },{ t: "How To Guides", d: "Expert tips for perfect results", c: "Tips", bg: `linear-gradient(135deg,${B.coral}90,${B.coralDk})` },{ t: "Visit Us", d: "Find a Peacock stockist", c: "Find store", bg: `linear-gradient(135deg,${B.gold}90,#C89820)` }].map((c, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: "hidden", transition: "transform .3s", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                  <div style={{ background: c.bg, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 44, opacity: .4, color: "#fff" }}>{["🎨","🖌️","📍"][i]}</span></div>
                  <div style={{ padding: 20, background: "#fff" }}><h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{c.t}</h3><p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>{c.d}</p><span style={{ fontSize: 13, fontWeight: 600, color: B.coral, display: "flex", alignItems: "center", gap: 4 }}>{c.c} <Arr /></span></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>)}

      {/* Footer */}
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
    </div>
  );
}
