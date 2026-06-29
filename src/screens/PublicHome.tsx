import { useState } from "react";

type PublicHomeProps = {
  onLoginClick?: () => void;
  onBrowseClick?: () => void;
  onSearchJobs?: (searchTerm: string) => void;
};

export default function PublicHome({
  onLoginClick,
  onBrowseClick,
  onSearchJobs,
}: PublicHomeProps) {
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearch() {
    if (onSearchJobs) {
      onSearchJobs(searchTerm);
    }
  }

  return (
    <div className="landing-page">
      <section className="saas-hero">
        <div className="saas-hero-content">
          <p className="eyebrow">
            Pivot Technology School Career Portal
          </p>

          <h1>Launch Your Tech Career With Confidence</h1>

          <p className="hero-description">
            Connect with live Software Development, Cybersecurity,
            and Data Analytics opportunities. Built specifically for
            Pivot Technology School students and alumni.
          </p>

          <div className="landing-search-bar">
            <input
              type="text"
              placeholder="React Developer, Cybersecurity, Data Analyst..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <input
              type="text"
              placeholder="Iowa, Tennessee, Louisiana, Remote"
              disabled
            />

            <button onClick={handleSearch}>
              Search Jobs
            </button>
          </div>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={onLoginClick}
            >
              Student / Alumni Login
            </button>

            <button
              className="secondary-btn"
              onClick={onBrowseClick}
            >
              Browse Opportunities
            </button>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <h3>75+</h3>
          <p>Live Opportunities</p>
        </div>

        <div className="stat-card">
          <h3>3</h3>
          <p>Career Tracks</p>
        </div>

        <div className="stat-card">
          <h3>Remote</h3>
          <p>Hybrid & On-Site</p>
        </div>

        <div className="stat-card">
          <h3>24/7</h3>
          <p>Career Resources</p>
        </div>
      </section>

      <section className="features-section">
        <h2>Featured Opportunities</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Software Development</h3>
            <p>
              Front-End Developer, React Developer,
              Full-Stack Developer, Software Engineer.
            </p>
            <button onClick={() => onSearchJobs?.("software developer")}>
              View Jobs
            </button>
          </div>

          <div className="feature-card">
            <h3>Cybersecurity</h3>
            <p>
              Security Analyst, SOC Analyst,
              Information Security, Apprenticeships.
            </p>
            <button onClick={() => onSearchJobs?.("cybersecurity")}>
              View Jobs
            </button>
          </div>

          <div className="feature-card">
            <h3>Data Analytics</h3>
            <p>
              Data Analyst, Business Intelligence,
              Reporting Analyst, SQL.
            </p>
            <button onClick={() => onSearchJobs?.("data analyst")}>
              View Jobs
            </button>
          </div>

          <div className="feature-card">
            <h3>Remote Opportunities</h3>
            <p>
              Remote software development,
              cybersecurity, and analytics jobs.
            </p>
            <button onClick={() => onSearchJobs?.("remote")}>
              View Jobs
            </button>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Student Success</h2>

        <div className="stats-section">
          <div className="stat-card">
            <h3>500+</h3>
            <p>Students Trained</p>
          </div>

          <div className="stat-card">
            <h3>100+</h3>
            <p>Alumni Network</p>
          </div>

          <div className="stat-card">
            <h3>75+</h3>
            <p>Live Opportunities</p>
          </div>

          <div className="stat-card">
            <h3>3</h3>
            <p>Career Tracks</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <h3>Pivot Tech Connect</h3>

        <p>
          Connecting Pivot Technology School students and alumni
          with technology opportunities and career resources.
        </p>

        <p>
          Software Development • Cybersecurity • Data Analytics
        </p>
      </footer>
    </div>
  );
}