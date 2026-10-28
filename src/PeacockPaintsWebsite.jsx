import { AppProvider } from "./context/AppContext.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import "./styles/global.css";

export default function PeacockPaintsWebsite() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
