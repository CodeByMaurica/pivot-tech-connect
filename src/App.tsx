import { useState } from "react";
import "./App.css";

import Dashboard from "./screens/Dashboard";
import JobOpenings from "./screens/JobOpenings";
import AlumniOutreach from "./screens/AlumniOutreach";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>Pivot Tech Connect</h2>
        <p>Apprenticeship Tracker</p>

        <button onClick={() => setActivePage("Dashboard")}>Dashboard</button>
        <button onClick={() => setActivePage("Jobs")}>Job Openings</button>
        <button onClick={() => setActivePage("Alumni")}>Alumni Outreach</button>
      </aside>

      <main className="main-content">
        {activePage === "Dashboard" && <Dashboard />}
        {activePage === "Jobs" && <JobOpenings />}
        {activePage === "Alumni" && <AlumniOutreach />}
      </main>
    </div>
  );
}

export default App;