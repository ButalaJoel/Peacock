import { lazy, Suspense } from "react";

// The dashboard code is only downloaded when someone opens #/dashboard, so it never slows the public site.
const DashboardPage = lazy(() => import("./DashboardPage.jsx"));

export default function DashboardEntry() {
  return (
    <Suspense fallback={<p style={{ padding: 60, textAlign: "center", color: "#777" }}>Loading...</p>}>
      <DashboardPage />
    </Suspense>
  );
}
