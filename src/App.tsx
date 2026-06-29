import { useEffect, useState } from "react";
import "./App.css";

import PublicHome from "./screens/PublicHome";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import JobOpenings from "./screens/JobOpenings";
import Resources from "./screens/Resources";
import About from "./screens/About";
import AlumniOutreach from "./screens/AlumniOutreach";

export type JobSearchFilters = {
  keyword: string;
  category: string;
  state: string;
  workType: string;
  level: string;
};

const defaultJobFilters: JobSearchFilters = {
  keyword: "",
  category: "All",
  state: "All",
  workType: "All",
  level: "All",
};

function App() {
  const [activeScreen, setActiveScreen] = useState("PublicHome");
  const [userRole, setUserRole] = useState("");
  const [jobFilters, setJobFilters] = useState<JobSearchFilters>(defaultJobFilters);

  useEffect(() => {
    const savedRole = localStorage.getItem("pivotUserRole");

    if (savedRole) {
      setUserRole(savedRole);
      setActiveScreen("Dashboard");
    }
  }, []);

  function handleLogin(role: string) {
    setUserRole(role);
    localStorage.setItem("pivotUserRole", role);
    setActiveScreen("Dashboard");
  }

  function handleLogout() {
    setUserRole("");
    localStorage.removeItem("pivotUserRole");
    setActiveScreen("PublicHome");
  }

  function openJobsWithFilters(filters: JobSearchFilters) {
    setJobFilters(filters);
    setActiveScreen("JobOpenings");
  }

  function openAllJobs() {
    setJobFilters(defaultJobFilters);
    setActiveScreen("JobOpenings");
  }

  function renderMainContent() {
    if (activeScreen === "PublicHome") {
      return (
        <PublicHome
          onLoginClick={() => setActiveScreen("Login")}
          onBrowseClick={openAllJobs}
          onSearchJobs={openJobsWithFilters}
        />
      );
    }

    if (activeScreen === "Login") return <Login onLogin={handleLogin} />;
    if (activeScreen === "Dashboard") return <Dashboard />;

    if (activeScreen === "JobOpenings") {
      return <JobOpenings initialFilters={jobFilters} />;
    }

    if (activeScreen === "Resources") return <Resources />;
    if (activeScreen === "AlumniOutreach") return <AlumniOutreach />;
    if (activeScreen === "About") return <About />;

    return <PublicHome onBrowseClick={openAllJobs} onSearchJobs={openJobsWithFilters} />;
  }

  const isLoggedIn = userRole !== "";

  return (
    <div className="app-layout">
      {isLoggedIn && (
        <aside className="sidebar">
          <div className="brand-box">
            <h2>Pivot Tech Connect</h2>
            <p>
              {userRole === "owner"
                ? "Owner Dashboard"
                : userRole === "alumni"
                ? "Alumni Career Portal"
                : "Student Career Portal"}
            </p>
          </div>

          <button onClick={() => setActiveScreen("Dashboard")}>Dashboard</button>
          <button onClick={openAllJobs}>Job Openings</button>
          <button onClick={() => setActiveScreen("Resources")}>Career Resources</button>

          {(userRole === "owner" || userRole === "alumni") && (
            <button onClick={() => setActiveScreen("AlumniOutreach")}>
              Alumni Outreach
            </button>
          )}

          <button onClick={() => setActiveScreen("About")}>About</button>

          <button className="delete-btn" onClick={handleLogout}>
            Logout
          </button>
        </aside>
      )}

      <div className="content-area">
        <header className="topbar">
          <div>
            <h3>Pivot Tech Connect</h3>
            <p>
              {isLoggedIn
                ? `Logged in as ${userRole}`
                : "Student & Alumni Career Portal for Pivot Technology School"}
            </p>
          </div>

          {!isLoggedIn && (
            <button onClick={() => setActiveScreen("Login")}>
              Student / Alumni Login
            </button>
          )}
        </header>

        <main className="main-content">{renderMainContent()}</main>
      </div>
    </div>
  );
}

export default App;