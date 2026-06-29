import { useState } from "react";
import type { JobSearchFilters } from "../App";

type PublicHomeProps = {
  onLoginClick?: () => void;
  onBrowseClick?: () => void;
  onSearchJobs?: (filters: JobSearchFilters) => void;
};

export default function PublicHome({
  onLoginClick,
  onBrowseClick,
  onSearchJobs,
}: PublicHomeProps) {
  const [filters, setFilters] = useState<JobSearchFilters>({
    keyword: "",
    category: "All",
    state: "All",
    workType: "All",
    level: "All",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleSearch() {
    if (onSearchJobs) {
      onSearchJobs(filters);
    }
  }

  return (
    <div className="landing-page">
      <section className="saas-hero">
        <div className="saas-hero-content">
          <p className="eyebrow">Pivot Technology School Career Portal</p>

          <h1>Launch Your Tech Career With Confidence</h1>

          <p className="hero-description">
            Search live Software Development, Cybersecurity, and Data Analytics
            opportunities for Pivot students and alumni.
          </p>

          <div className="landing-search-bar landing-search-bar-full">
            <input
              name="keyword"
              type="text"
              placeholder="Job title or keyword"
              value={filters.keyword}
              onChange={handleChange}
            />

            <select name="category" value={filters.category} onChange={handleChange}>
              <option>All</option>
              <option>Software Development</option>
              <option>Cybersecurity</option>
              <option>Data Analytics</option>
            </select>

            <select name="state" value={filters.state} onChange={handleChange}>
              <option>All</option>
              <option>Iowa</option>
              <option>Tennessee</option>
              <option>Louisiana</option>
              <option>Remote</option>
            </select>

            <select name="workType" value={filters.workType} onChange={handleChange}>
              <option>All</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-Site</option>
            </select>

            <select name="level" value={filters.level} onChange={handleChange}>
              <option>All</option>
              <option>Entry Level</option>
              <option>Mid Level</option>
              <option>Senior Level</option>
              <option>Internship</option>
              <option>Apprenticeship</option>
            </select>

            <button onClick={handleSearch}>Search Jobs</button>
          </div>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={onLoginClick}>
              Student / Alumni Login
            </button>

            <button className="secondary-btn" onClick={onBrowseClick}>
              Browse All Opportunities
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
          <h3>IA</h3>
          <p>TN • LA</p>
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
            <p>Front-End, React, Full-Stack, Web Developer, and Software Engineer roles.</p>
            <button
              onClick={() =>
                onSearchJobs?.({
                  keyword: "",
                  category: "Software Development",
                  state: "All",
                  workType: "All",
                  level: "All",
                })
              }
            >
              View Jobs
            </button>
          </div>

          <div className="feature-card">
            <h3>Cybersecurity</h3>
            <p>Security Analyst, SOC Analyst, information security, and apprenticeships.</p>
            <button
              onClick={() =>
                onSearchJobs?.({
                  keyword: "",
                  category: "Cybersecurity",
                  state: "All",
                  workType: "All",
                  level: "All",
                })
              }
            >
              View Jobs
            </button>
          </div>

          <div className="feature-card">
            <h3>Data Analytics</h3>
            <p>Data Analyst, reporting, SQL, dashboard, and BI opportunities.</p>
            <button
              onClick={() =>
                onSearchJobs?.({
                  keyword: "",
                  category: "Data Analytics",
                  state: "All",
                  workType: "All",
                  level: "All",
                })
              }
            >
              View Jobs
            </button>
          </div>

          <div className="feature-card">
            <h3>Remote Opportunities</h3>
            <p>Remote software development, cybersecurity, and analytics positions.</p>
            <button
              onClick={() =>
                onSearchJobs?.({
                  keyword: "",
                  category: "All",
                  state: "All",
                  workType: "Remote",
                  level: "All",
                })
              }
            >
              View Jobs
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <h3>Pivot Tech Connect</h3>
        <p>
          Connecting Pivot Technology School students and alumni with technology
          opportunities and career resources.
        </p>
        <p>Software Development • Cybersecurity • Data Analytics</p>
      </footer>
    </div>
  );
}