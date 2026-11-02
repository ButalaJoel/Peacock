import UpdatesSlider from "./UpdatesSlider.jsx";
import NewsletterSignup from "./NewsletterSignup.jsx";

// Home page section: latest news and updates, with the email signup underneath.
export default function Newsletter() {
  return (
    <section style={{ background: "#faf8f5", padding: "70px 0" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#888", marginBottom: 8 }}>News and updates</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, marginBottom: 26 }}>What's new at Peacock Paints</h2>
        <UpdatesSlider />
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: "30px 30px", marginTop: 40, maxWidth: 620 }}>
          <NewsletterSignup />
        </div>
      </div>
    </section>
  );
}
