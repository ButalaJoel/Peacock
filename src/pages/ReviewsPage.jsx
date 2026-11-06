import { useApp } from "../context/useApp.js";
import { B } from "../data/theme.js";
import { useReviews } from "../lib/useReviews.js";
import PageHero from "../components/common/PageHero.jsx";

const Stars = ({ n }) => <span aria-label={n + " out of 5 stars"} style={{ color: B.coral, fontSize: 18, letterSpacing: 2 }}>{"★".repeat(n)}<span style={{ color: "#ddd" }}>{"★".repeat(5 - n)}</span></span>;

export default function ReviewsPage() {
  const { nav, makeHref } = useApp();
  const reviews = useReviews();
  const avg = reviews && reviews.length ? (reviews.reduce((t, r) => t + r.rating, 0) / reviews.length).toFixed(1) : null;
  const go = (e, page) => { e.preventDefault(); nav(page); };
  return (
    <div>
      <PageHero kicker="Customer reviews" title="What our customers say" subtitle={avg ? avg + " out of 5, from " + reviews.length + " review" + (reviews.length === 1 ? "" : "s") : "Real words from people who use Peacock Paints."} gradient="linear-gradient(135deg, #1F6F78, #2A9AA5)" />
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "46px 24px 70px" }}>
        {reviews === null && <p style={{ textAlign: "center", color: "#777" }}>Loading...</p>}
        {reviews && reviews.length === 0 && <p style={{ textAlign: "center", color: "#666", fontSize: 16, lineHeight: 1.7 }}>Customer reviews will appear here soon.</p>}
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {(reviews || []).map(r => (
            <figure key={r.id} style={{ margin: 0, background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column" }}>
              <Stars n={r.rating} />
              <blockquote style={{ margin: "12px 0 16px", fontSize: 15, lineHeight: 1.75, color: "#333", flex: 1 }}>&ldquo;{r.body}&rdquo;</blockquote>
              <figcaption style={{ fontSize: 13.5, color: "#666" }}><strong style={{ color: "#222" }}>{r.display_name}</strong>{r.product ? " · " + r.product : ""}{r.place ? " · " + r.place : ""}</figcaption>
            </figure>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a className="btn bp" href={makeHref("feedback")} onClick={e => go(e, "feedback")} style={{ textDecoration: "none" }}>Share your experience</a>
        </div>
      </section>
    </div>
  );
}
