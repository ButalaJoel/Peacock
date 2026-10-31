import EstimatorPage from "./EstimatorPage.jsx";
import { CATEGORY_PAGES } from "../data/products.js";
import { B } from "../data/theme.js";
import { storyPages } from "../data/storyPages.js";
import { trendingColours, COLOUR_CATEGORIES, STYLE_CATEGORIES } from "../data/colours.js";
import { BEDROOM_INSPIRATIONS, LIVING_ROOM_INSPIRATIONS, DINING_ROOM_INSPIRATIONS, KITCHEN_INSPIRATIONS, BATHROOM_INSPIRATIONS } from "../data/inspirations.js";
import { ArrL } from "../components/icons/Icons.jsx";
import PaintCategoryPage from "./PaintCategoryPage.jsx";
import ProductDetailPage from "./ProductDetailPage.jsx";
import RoomInspirationPage from "./RoomInspirationPage.jsx";
import ColourCategoryPage from "./ColourCategoryPage.jsx";
import StyleCategoryPage from "./StyleCategoryPage.jsx";
import ColourDetailPage from "./ColourDetailPage.jsx";
import { useApp } from "../context/useApp.js";
import HomePage from "./HomePage.jsx";
import StoryPage from "./StoryPage.jsx";

export default function PageSwitch() {
  const { pg, selectedProduct, selectedColour, setSelectedColour, selectedColourCategory, setSelectedColourCategory, selectedColourStyle, setSelectedColourStyle, handleColourClick, nav, openProduct, makeHref, productHref, colourHref, aReset, addToCart, addSamplePot, addSampleBundle, currentColourCatName, currentStyleName } = useApp();
  return (
    <>
      {pg === "estimator" ? (
        <EstimatorPage />
      ) : CATEGORY_PAGES[pg] ? (
        <PaintCategoryPage key={pg} slug={pg} onOpenProduct={openProduct} productHrefFn={productHref} homeHref={makeHref("home")} nav={nav} />
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
        <><div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}><a href={makeHref("home")} onClick={e => { e.preventDefault(); nav("home"); }} style={{ ...aReset, fontSize: 13, color: B.coral, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}><ArrL /> Home</a></div><StoryPage pageKey={pg} /></>
      ) : (
        <HomePage />
      )}
    </>
  );
}
