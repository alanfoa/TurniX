import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { AdminDashboard } from "./components/AdminDashboard";

type View = "landing" | "dashboard";

export default function App() {
  const [view, setView] = useState<View>("landing");

  return (
    <div className="w-full h-full">
      {view === "landing" ? (
        <LandingPage onGoToDashboard={() => setView("dashboard")} />
      ) : (
        <AdminDashboard onGoToLanding={() => setView("landing")} />
      )}
    </div>
  );
}
