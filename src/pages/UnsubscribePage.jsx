import { CONTACT } from "../config/contact.js";
import { B } from "../data/theme.js";
import PageHero from "../components/common/PageHero.jsx";
import { mailtoUrl } from "../utils/messaging.js";

// Unsubscribe route (#/unsubscribe). Opens an email to sales@ asking to be removed, which staff action in the dashboard.
export default function UnsubscribePage() {
  return (
    <div>
      <PageHero kicker="Newsletter" title="Unsubscribe" subtitle="You can stop our monthly newsletter at any time." gradient="linear-gradient(135deg, #1F6F78, #2A9AA5)" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 70px", lineHeight: 1.8, fontSize: 15 }}>
        <p>Press the button below. Your email app will open with a message asking us to remove you from the newsletter. Please press send, and we will remove your address.</p>
        <p style={{ marginTop: 14 }}>You can also write to us at <a href={"mailto:" + CONTACT.salesEmail} style={{ color: B.coral }}>{CONTACT.salesEmail}</a>. To have your details deleted altogether, say so in the same message.</p>
        <a className="btn bp" style={{ background: B.coral, marginTop: 22, display: "inline-flex" }}
          href={mailtoUrl(CONTACT.salesEmail, "Unsubscribe", "Please remove me from the Peacock Paints newsletter.\n\nMy email address: ")}>Email us to unsubscribe</a>
      </div>
    </div>
  );
}
