import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import Login from "./Login.jsx";
import ProjectsAdmin from "./ProjectsAdmin.jsx";
import NewsAdmin from "./NewsAdmin.jsx";
import QuotesAdmin from "./QuotesAdmin.jsx";
import EnquiriesAdmin from "./EnquiriesAdmin.jsx";
import SubscribersAdmin from "./SubscribersAdmin.jsx";
import AlertsAdmin from "./AlertsAdmin.jsx";
import ApplicationsAdmin from "./ApplicationsAdmin.jsx";
import FeedbackAdmin from "./FeedbackAdmin.jsx";
import AwardsAdmin from "./AwardsAdmin.jsx";
import ReviewsAdmin from "./ReviewsAdmin.jsx";
import ProfessionalsAdmin from "./ProfessionalsAdmin.jsx";
import MediaAdmin from "./MediaAdmin.jsx";
import { S } from "./ui.js";

const COMING = [];

export default function DashboardPage() {
  const [session, setSession] = useState(undefined);
  const [staff, setStaff] = useState({ uid: null, role: undefined });
  const [tab, setTab] = useState("projects");
  const [fresh, setFresh] = useState({ quotes: 0, enquiries: 0, alerts: 0, applications: 0, feedback: 0, professionals: 0 });
  const uid = session ? session.user.id : null;

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !uid) return undefined;
    let off = false;
    supabase.from("staff").select("role").eq("user_id", uid).maybeSingle()
      .then(({ data }) => { if (!off) setStaff({ uid, role: data ? data.role : false }); });
    return () => { off = true; };
  }, [uid]);

  const role = staff.uid === uid ? staff.role : undefined;
  const isStaff = !!role;
  const countNew = useCallback(() => {
    const count = table => supabase.from(table).select("id", { count: "exact", head: true }).eq("status", "new").then(({ count: c }) => c || 0);
    const openAlerts = supabase.from("lead_alerts").select("id", { count: "exact", head: true }).eq("status", "open").then(({ count: c }) => c || 0);
    Promise.all([count("quote_requests"), count("enquiries"), openAlerts, count("dealer_applications"), count("feedback"), count("professional_requests")]).then(([quotes, enquiries, alerts, applications, feedback, professionals]) => setFresh({ quotes, enquiries, alerts, applications, feedback, professionals }));
  }, []);
  useEffect(() => { if (supabase && isStaff) countNew(); }, [isStaff, tab, countNew]);

  if (!supabase) return <p style={{ padding: 60, textAlign: "center" }}>The database is not connected yet (src/config/supabase.js is blank).</p>;
  if (session === undefined) return <p style={{ padding: 60, textAlign: "center", color: "#777" }}>Loading...</p>;
  if (!session) return <Login />;
  if (role === undefined) return <p style={{ padding: 60, textAlign: "center", color: "#777" }}>Checking your access...</p>;
  if (role === false) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "70px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, marginBottom: 10 }}>No access</h1>
        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 20 }}>You are signed in as {session.user.email}, but this account has not been added to the staff list. Ask an administrator to add you.</p>
        <button style={S.btnGhost} onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
    );
  }

  const badge = n => (n ? " (" + n + " new)" : "");
  const TABS = [["projects", "Projects"], ["news", "News & updates"], ["quotes", "Quote requests" + badge(fresh.quotes)], ["enquiries", "Enquiries" + badge(fresh.enquiries)], ["applications", "Applications" + badge(fresh.applications)], ["feedback", "Feedback" + badge(fresh.feedback)], ["reviews", "Reviews"], ["professionals", "Professionals" + badge(fresh.professionals)], ["awards", "Awards"], ["media", "Media library"], ["alerts", "Alerts" + (fresh.alerts ? " (" + fresh.alerts + " waiting)" : "")], ["subscribers", "Newsletter subscribers"]];
  return (
    <div style={S.wrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 26 }}>
        <div>
          <h1 style={{ fontSize: 28 }}>Website dashboard</h1>
          <p style={{ fontSize: 13, color: "#777", marginTop: 4 }}>Signed in as {session.user.email} ({role})</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="#/" style={{ ...S.btnGhost, textDecoration: "none" }}>View website</a>
          <button style={S.btnGhost} onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} aria-pressed={tab === id} style={{ padding: "8px 18px", borderRadius: 30, border: "1px solid " + (tab === id ? "#222" : "#ccc"), background: tab === id ? "#222" : "#fff", color: tab === id ? "#fff" : "#333", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
        ))}
        {COMING.map(c => <span key={c} title="Coming in a later step" style={{ padding: "8px 18px", borderRadius: 30, border: "1px dashed #ccc", color: "#aaa", fontSize: 13 }}>{c}</span>)}
      </div>
      {tab === "projects" && <ProjectsAdmin />}
      {tab === "news" && <NewsAdmin />}
      {tab === "quotes" && <QuotesAdmin onChange={countNew} />}
      {tab === "enquiries" && <EnquiriesAdmin onChange={countNew} />}
      {tab === "applications" && <ApplicationsAdmin isAdmin={role === "admin"} onChange={countNew} />}
      {tab === "professionals" && <ProfessionalsAdmin isAdmin={role === "admin"} onChange={countNew} />}
      {tab === "media" && <MediaAdmin />}
      {tab === "reviews" && <ReviewsAdmin />}
      {tab === "awards" && <AwardsAdmin />}
      {tab === "feedback" && <FeedbackAdmin isAdmin={role === "admin"} onChange={countNew} />}
      {tab === "alerts" && <AlertsAdmin isAdmin={role === "admin"} onChange={countNew} />}
      {tab === "subscribers" && <SubscribersAdmin />}
    </div>
  );
}
