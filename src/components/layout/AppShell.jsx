import QuoteModal from "./QuoteModal.jsx";
import AnnouncementBar from "./AnnouncementBar.jsx";
import Header from "./Header.jsx";
import SearchModal from "./SearchModal.jsx";
import CartDrawer from "./CartDrawer.jsx";
import MobileMenu from "./MobileMenu.jsx";
import Footer from "./Footer.jsx";
import PageSwitch from "../../pages/PageSwitch.jsx";

export default function AppShell() {
  return (
    <div style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif", color: "#1a1a1a", background: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <AnnouncementBar />
      <Header />
      <SearchModal />
      <CartDrawer />
      <QuoteModal />
      <MobileMenu />
      <PageSwitch />
      <Footer />
    </div>
  );
}
