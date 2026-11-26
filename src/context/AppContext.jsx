import { useState, useEffect, useRef } from "react";
import { AppContext } from "./useApp.js";
import { PRODUCTS, SAMPLE_POT, SAMPLE_BUNDLE } from "../data/products.js";
import { COLOUR_CATEGORIES, STYLE_CATEGORIES } from "../data/colours.js";
import { resolveRoute, findColourCat as findCat, pathForPage, pathForProduct, pathForColour } from "../routing.js";
import { getRouteMeta, applyHead } from "../seo/routes.js";
import { TruckIcon, PaletteIcon, HeartIcon, GlobeIcon, UsersIcon, LeafIcon } from "../components/icons/Icons.jsx";

export function AppProvider({ children, initialPath }) {
  // The first page comes from the URL, so the browser renders exactly what was prerendered.
  const [start] = useState(() => resolveRoute(initialPath ?? (typeof window !== "undefined" ? window.location.pathname : "/")));
  const [activeMenu, setActiveMenu] = useState(null);

  const [mobMenu, setMobMenu] = useState(false);

  const [mobSub, setMobSub] = useState(null);

  const [searchOpen, setSearchOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [pg, setPg] = useState(start.pg);

  const [prodTab, setProdTab] = useState("all");

  const [finishFilter, setFinishFilter] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(start.product || null);

  const [cart, setCart] = useState([]);

  const [cartOpen, setCartOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const [selectedColour, setSelectedColour] = useState(start.colour || null);

  const [selectedColourCategory, setSelectedColourCategory] = useState(start.colourCategory || null);

  const [selectedColourStyle, setSelectedColourStyle] = useState(null);

  const [colourCarouselIdx, setColourCarouselIdx] = useState(0);

  const CARDS_VISIBLE = 5;

  const findColourCat = findCat;

  const go = path => { if (window.location.pathname !== path) window.history.pushState({}, "", path); };

  const handleColourClick = (c) => { const cat = findColourCat(c.name); setSelectedColour(c); setSelectedColourCategory(cat); setPg("colour-detail"); setActiveMenu(null); setMobMenu(false); setMobSub(null); window.scrollTo({ top: 0, behavior: "smooth" }); go(pathForColour(c)); };

  const mRef = useRef(null);

  const prodSectionRef = useRef(null);

  const scrollToProdPending = useRef(false);

  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  // ─── Real URL paths: back/forward buttons restore the page ───
  useEffect(() => {
    const onPop = () => {
      const r = resolveRoute(window.location.pathname);
      setSelectedProduct(r.product || null);
      setSelectedColour(r.colour || null);
      setSelectedColourCategory(r.colourCategory || null);
      setPg(r.pg);
      setActiveMenu(null); setMobMenu(false); setMobSub(null);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Keep the tab title, description and share tags in step with the page being shown.
  useEffect(() => { applyHead(getRouteMeta(window.location.pathname)); }, [pg, selectedProduct, selectedColour]);

  useEffect(() => {
    if (scrollToProdPending.current && prodSectionRef.current) {
      scrollToProdPending.current = false;
      const t = setTimeout(() => prodSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      return () => clearTimeout(t);
    }
  }, [finishFilter]);

  const mE = i => { clearTimeout(mRef.current); setActiveMenu(i); };

  const mL = () => { mRef.current = setTimeout(() => setActiveMenu(null), 200); };

  const nav = p => { setPg(p); setSelectedProduct(null); setActiveMenu(null); setMobMenu(false); setMobSub(null); window.scrollTo({ top: 0, behavior: "smooth" }); go(pathForPage(p)); };

  const openProduct = (p) => { setSelectedProduct(p); setPg("product"); setActiveMenu(null); setMobMenu(false); setMobSub(null); window.scrollTo({ top: 0, behavior: "smooth" }); go(pathForProduct(p)); };

  // ─── Hash URL helpers ───
  const makeHref = (slug) => pathForPage(slug);

  const productHref = (p) => pathForProduct(p);

  const colourHref = (c) => pathForColour(c);

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
