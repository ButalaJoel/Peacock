import { CONTACT } from "../config/contact.js";
import PageHero from "../components/common/PageHero.jsx";

const SECTIONS = [
  ["Who we are", [CONTACT.companyName + " (\"Peacock Paints\", \"we\") is a paint manufacturer in Uganda. This notice explains what personal information this website collects, why, and what your rights are. It applies to " + CONTACT.website + "."]],
  ["What we collect, and when", [
    "Newsletter: your email address when you subscribe.",
    "Quote requests: the name, phone number, email address and the products and colours you choose when you ask for a quote.",
    "Contact messages: your name, phone number, email address and what you write to us.",
    "Distributor and dealer applications: your name, phone, email, business name, shop location, four photos of your shop, years in business, registration and tax (TIN) status, and the name, phone number and relationship of a next of kin.",
    "Complaints and feedback: your name, phone or email, the product, where you bought it, and your message and rating.",
    "WhatsApp and email: when you use the WhatsApp or email buttons, the message is sent from your own app, so WhatsApp or your email provider handles it under their own terms.",
  ]],
  ["Why we use it", [
    "To reply to you, prepare quotes, handle complaints and feedback, send the newsletter you asked for, and assess applications to become a distributor or dealer.",
    "To make sure no request is missed, our team receives an internal alert when a new request arrives. We may send you an automatic acknowledgement.",
    "We do not sell your information, and we do not use it for anything unrelated to the reasons above.",
  ]],
  ["Who can see it", [
    "Only authorised Peacock Paints staff with a login can see requests, applications and photos. Shop photos are kept in private storage.",
    "Our website and database are provided by trusted technology suppliers who store data on our behalf on secure cloud servers, which may be outside Uganda. They may only use it to run the service for us.",
  ]],
  ["How long we keep it", ["We keep personal information only as long as we need it for the reasons above or as the law requires, and then delete or anonymise it. You can ask us to delete your information sooner (see below)."]],
  ["Your rights", [
    "You can ask to see the personal information we hold about you, correct it, or delete it, and you can unsubscribe from the newsletter at any time.",
    "If you give us details about another person, such as a next of kin, please make sure they know and are happy for you to do so.",
    "You may also complain to the Personal Data Protection Office in Uganda if you believe your information has been handled unlawfully.",
  ]],
  ["Contact us", ["To use any of these rights or ask a question, email " + CONTACT.salesEmail + " or call " + CONTACT.phones.join(" / ") + ". Please quote your reference number if you have one."]],
];

export default function PrivacyPage() {
  return (
    <div>
      <PageHero kicker="Your information" title="Privacy notice" subtitle="How Peacock Paints looks after the information you give us on this website." gradient="linear-gradient(135deg, #1F6F78, #2A9AA5)" />
      <section style={{ maxWidth: 780, margin: "0 auto", padding: "44px 24px 70px" }}>
        {SECTIONS.map(([title, items]) => (
          <div key={title} style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 22, marginBottom: 10 }}>{title}</h2>
            {items.length === 1
              ? <p style={{ fontSize: 15, color: "#444", lineHeight: 1.8 }}>{items[0]}</p>
              : <ul style={{ paddingLeft: 20, margin: 0 }}>{items.map(t => <li key={t} style={{ fontSize: 15, color: "#444", lineHeight: 1.8, marginBottom: 6 }}>{t}</li>)}</ul>}
          </div>
        ))}
      </section>
    </div>
  );
}
