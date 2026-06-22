import { useState } from "react";
import "./App.css";

import Dashboard from "./screens/Dashboard";
import JobOpenings from "./screens/JobOpenings";
import Resources from "./screens/Resources";
import About from "./screens/About";
import AlumniOutreach from "./screens/AlumniOutreach";

function App() {
  const [activeScreen, setActiveScreen] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNavigation(screen: string) {
    setActiveScreen(screen);
    setMenuOpen(false);
  }

  function renderMainContent() {
    if (activeScreen === "Dashboard") return <Dashboard />;
    if (activeScreen === "JobOpenings") return <JobOpenings />;
    if (activeScreen === "Resources") return <Resources />;
    if (activeScreen === "AlumniOutreach") return <AlumniOutreach />;
    if (activeScreen === "About") return <About />;

    return <Dashboard />;
  }

  return (
    <div className="app-layout">
      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open navigation menu"
      >
        ☰
      </button>

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-box">
          <h2>Pivot Tech Connect</h2>
          <p>Student & Alumni Career Portal</p>
        </div>

        <button onClick={() => handleNavigation("Dashboard")}>Dashboard</button>

        <button onClick={() => handleNavigation("JobOpenings")}>
          Job Openings
        </button>

        <button onClick={() => handleNavigation("Resources")}>
          Career Resources
        </button>

        <button onClick={() => handleNavigation("AlumniOutreach")}>
          Alumni Outreach
        </button>

        <button onClick={() => handleNavigation("About")}>About</button>
      </aside>

      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)}></div>
      )}

      <div className="content-area">
        <header className="topbar">
          <div>
            <h3>Pivot Tech Connect</h3>
            <p>Student & Alumni Career Portal for Pivot Technology School</p>
          </div>
        </header>

        <main className="main-content">{renderMainContent()}</main>
      </div>
    </div>
  );
}

export default App;