import { useState, useEffect, useRef } from "react";
import { AppContext } from "./useApp.js";
import { PRODUCTS, SAMPLE_POT, SAMPLE_BUNDLE } from "../data/products.js";
import { trendingColours, COLOUR_CATEGORIES, STYLE_CATEGORIES } from "../data/colours.js";
import { TruckIcon, PaletteIcon, HeartIcon, GlobeIcon, UsersIcon, LeafIcon } from "../components/icons/Icons.jsx";

export function AppProvider({ children }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const [mobMenu, setMobMenu] = useState(false);

  const [mobSub, setMobSub] = useState(null);

  const [searchOpen, setSearchOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [pg, setPg] = useState("home");

  const [prodTab, setProdTab] = useState("all");

  const [finishFilter, setFinishFilter] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [cart, setCart] = useState([]);

  const [cartOpen, setCartOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const [selectedColour, setSelectedColour] = useState(null);

  const [selectedColourCategory, setSelectedColourCategory] = useState(null);

  const [selectedColourStyle, setSelectedColourStyle] = useState(null);

  const [colourCarouselIdx, setColourCarouselIdx] = useState(0);

  const CARDS_VISIBLE = 5;

  const findColourCat = (name) => { for (const [k, v] of Object.entries(COLOUR_CATEGORIES)) { if (v.colors.includes(name)) return k; } return null; };

  const handleColourClick = (c) => { const cat = findColourCat(c.name); setSelectedColour(c); setSelectedColourCategory(cat); setPg("colour-detail"); setActiveMenu(null); setMobMenu(false); setMobSub(null); window.scrollTo({ top: 0, behavior: "smooth" }); window.location.hash = `/colour/${encodeURIComponent(c.name)}`; };

  const mRef = useRef(null);

  const prodSectionRef = useRef(null);

  const scrollToProdPending = useRef(false);

  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

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

  const nav = p => { setPg(p); setSelectedProduct(null); setActiveMenu(null); setMobMenu(false); setMobSub(null); window.scrollTo({ top: 0, behavior: "smooth" }); window.location.hash = `/${p}`; };

  const openProduct = (p) => { setSelectedProduct(p); setPg("product"); setActiveMenu(null); setMobMenu(false); setMobSub(null); window.scrollTo({ top: 0, behavior: "smooth" }); window.location.hash = `/product/${p.id}`; };

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
    addToCart({ product: SAMPLE_POT, size: "100ml", qty: 1, colour: colourName });
    setCartOpen(true);
  };

  const addSampleBundle = () => {
    addToCart({ product: SAMPLE_BUNDLE, size: "5 pots", qty: 1, colour: null });
    setCartOpen(true);
  };

  const removeFromCart = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));

  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const weathershield = PRODUCTS.find(p => p.id === "weathershield-plus");

  const iconFor = s => ({ globe: <GlobeIcon/>, heart: <HeartIcon/>, palette: <PaletteIcon/>, users: <UsersIcon/>, leaf: <LeafIcon/>, truck: <TruckIcon/> }[s] || <PaletteIcon/>);

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

  const handleMegaFooter = (label) => {
    if (label === "Shop all colours") nav("all-colours");
    if (label === "All decorative paints") nav("decorative-paints");
    if (label === "All industrial coatings") nav("industrial-coatings");
    
    if (label === "Get inspired") nav("bedroom-inspiration");
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const catOk = prodTab === "all" || p.category === prodTab;
    const finishOk = true; // finish filter retired: the catalogue has no finish data
    return catOk && finishOk;
  });

  const currentColourCatName = Object.keys(COLOUR_CATEGORIES).find(k => COLOUR_CATEGORIES[k].slug === pg) || null;

  const currentStyleName = Object.keys(STYLE_CATEGORIES).find(k => STYLE_CATEGORIES[k].slug === pg) || null;

  const value = {
    openHeroProductGrid,
    activeMenu,
    setActiveMenu,
    mobMenu,
    setMobMenu,
    mobSub,
    setMobSub,
    searchOpen,
    setSearchOpen,
    scrolled,
    setScrolled,
    pg,
    setPg,
    prodTab,
    setProdTab,
    finishFilter,
    setFinishFilter,
    selectedProduct,
    setSelectedProduct,
    cart,
    setCart,
    cartOpen,
    setCartOpen,
    quoteOpen,
    setQuoteOpen,
    selectedColour,
    setSelectedColour,
    selectedColourCategory,
    setSelectedColourCategory,
    selectedColourStyle,
    setSelectedColourStyle,
    colourCarouselIdx,
    setColourCarouselIdx,
    CARDS_VISIBLE,
    findColourCat,
    handleColourClick,
    mRef,
    prodSectionRef,
    scrollToProdPending,
    mE,
    mL,
    nav,
    openProduct,
    makeHref,
    productHref,
    colourHref,
    aReset,
    addToCart,
    addSamplePot,
    addSampleBundle,
    removeFromCart,
    cartCount,
    weathershield,
    iconFor,
    handleMegaFooter,
    filteredProducts,
    currentColourCatName,
    currentStyleName,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
