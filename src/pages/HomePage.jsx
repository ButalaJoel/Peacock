import Hero from "../components/home/Hero.jsx";
import DoorsSection from "../components/home/DoorsSection.jsx";
import TrendingColours from "../components/home/TrendingColours.jsx";
import ProductCatalogue from "../components/home/ProductCatalogue.jsx";
import Newsletter from "../components/home/Newsletter.jsx";
import InfoCards from "../components/home/InfoCards.jsx";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DoorsSection />
      <TrendingColours />
      <ProductCatalogue />
      <Newsletter />
      <InfoCards />
    </>
  );
}
