import { useState, useEffect } from "react";
import { INSPO_SCANDI_SAGE, INSPO_LR_PALE_BEIGE, INSPO_KT_CREAM } from "../../data/images.js";
import { trendingColours } from "../../data/colours.js";
import { heroPhoto } from "../../data/heroPhotos.js";
import { Arr, ArrL } from "../icons/Icons.jsx";
import { useApp } from "../../context/useApp.js";

export default function Hero() {
  const { handleColourClick, nav, openHeroProductGrid } = useApp();
  const [heroSlide, setHeroSlide] = useState(0);

  const [heroPaused, setHeroPaused] = useState(false);

  useEffect(() => {
    if (heroPaused) return undefined;
    const t = setInterval(() => setHeroSlide(s => (s + 1) % 3), 6500);
    return () => clearInterval(t);
  }, [heroPaused]);

  const heroSlides = [
    {
      eyebrow: "New colour studio",
      title: "Paint your next room before the first brush stroke.",
      copy: "Compare Peacock shades, finishes, and real products in one warm studio built for homes, schools, shops, and site teams.",
      accent: "#ff4d8b",
      roomImg: heroPhoto(0, INSPO_SCANDI_SAGE),
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
      roomImg: heroPhoto(1, INSPO_LR_PALE_BEIGE),
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
      eyebrow: "Industrial coatings",
      title: "From polished walls to tough workshop floors.",
      copy: "Browse coatings for wood, vehicles, decorative walls, and industrial surfaces with the same colour-first energy.",
      accent: "#b8a4ed",
      roomImg: heroPhoto(2, INSPO_KT_CREAM),
      swatches: [
        { name: "Violet Bouquet", color: "#C0A0C8" },
        { name: "Copper", color: "#AD6040" },
        { name: "Pearl", color: "#EEE7C5" },
        { name: "Signal Blue", color: "#2848A0" },
      ],
      note: "Specialist systems",
      cta2: "Industrial coatings",
      cta2Page: "industrial",
    },
  ];

  const currentHero = heroSlides[heroSlide] || heroSlides[0];

  const shopHeroProducts = () => openHeroProductGrid("all");

  const exploreHero = () => {
    if (currentHero.cta2Page === "colours") { nav("all-colours"); return; }
    if (currentHero.cta2Page === "industrial") { nav("industrial-coatings"); return; }
    nav(currentHero.cta2Page);
  };

  const showHeroSlide = (idx) => setHeroSlide((idx + heroSlides.length) % heroSlides.length);

  const openHeroSwatch = (swatch) => {
    const match = trendingColours.find(c => c.name === swatch.name);
    if (match) handleColourClick(match);
  };

  return (
    <>
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
                <div><strong>1988</strong><span>Made in Uganda</span></div>
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
    </>
  );
}
