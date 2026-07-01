import { useEffect, useMemo, useState } from "react";
import { getRealJobs, type Job } from "../services/jobsApi";

const categories = [
  "All Categories",
  "Software Development",
  "Cybersecurity",
  "Data Analytics",
];

const levels = ["All Levels", "Entry Level", "Mid Level", "Senior Level"];

const jobTypes = [
  "All Types",
  "Full-time",
  "Part-time",
  "Contractor",
  "Internship",
  "Apprenticeship",
];

function shortenText(text: string, limit = 220): string {
  if (!text) return "No description available.";
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

function organizeDescription(description: string) {
  const text = description || "No description available.";

  const responsibilitiesIndex = text.search(
    /responsibilities|what you'll do|what you will do|key responsibilities/i
  );

  const qualificationsIndex = text.search(
    /qualifications|requirements|about you|what you bring|basic qualifications|preferred qualifications/i
  );

  const overview =
    responsibilitiesIndex > 0
      ? text.slice(0, responsibilitiesIndex).trim()
      : text.slice(0, 700).trim();

  const responsibilities =
    responsibilitiesIndex > -1 && qualificationsIndex > responsibilitiesIndex
      ? text.slice(responsibilitiesIndex, qualificationsIndex).trim()
      : "";

  const qualifications =
    qualificationsIndex > -1
      ? text.slice(qualificationsIndex, qualificationsIndex + 1400).trim()
      : "";

  return {
    overview,
    responsibilities,
    qualifications,
    fullDescription: text,
  };
}

export default function JobOpenings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [keyword, setKeyword] = useState("software developer");
  const [location, setLocation] = useState("United States");

  const [searchKeyword, setSearchKeyword] = useState("software developer");
  const [searchLocation, setSearchLocation] = useState("United States");

  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getRealJobs(keyword, location);

        setJobs(data);
        setSelectedJob(data[0] ?? null);
      } catch (error) {
        console.error("Job loading error:", error);
        setJobs([]);
        setSelectedJob(null);
        setErrorMessage("Unable to load jobs right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadJobs();
  }, [keyword, location]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const categoryText = `
        ${job.title}
        ${job.category}
        ${job.description}
      `.toLowerCase();

      const matchesCategory =
        categoryFilter === "All Categories" ||
        categoryText.includes(categoryFilter.toLowerCase());

      const matchesLevel =
        levelFilter === "All Levels" || job.level === levelFilter;

      const matchesType =
        typeFilter === "All Types" ||
        job.type.toLowerCase().includes(typeFilter.toLowerCase());

      return matchesCategory && matchesLevel && matchesType;
    });
  }, [jobs, categoryFilter, levelFilter, typeFilter]);

  function handleSearch() {
    setKeyword(searchKeyword);
    setLocation(searchLocation);
  }

  function clearFilters() {
    setCategoryFilter("All Categories");
    setLevelFilter("All Levels");
    setTypeFilter("All Types");
  }

  const organizedJob = selectedJob
    ? organizeDescription(selectedJob.description)
    : null;

  return (
    <main className="jobs-page redesigned-jobs-page">
      <section className="jobs-hero">
        <p className="eyebrow">Pivot Tech Connect</p>
        <h1>Find Your Next Tech Opportunity</h1>
        <p>
          Search live software, cybersecurity, data, internship, apprenticeship,
          remote, and entry-level opportunities.
        </p>
      </section>

      <section className="job-search-card">
        <div className="job-search-grid">
          <label>
            <span>What</span>
            <input
              type="text"
              placeholder="Job title, company, or skill"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
          </label>

          <label>
            <span>Where</span>
            <input
              type="text"
              placeholder="City, state, or remote"
              value={searchLocation}
              onChange={(event) => setSearchLocation(event.target.value)}
            />
          </label>
        </div>

        <div className="job-filter-row">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <select
            value={levelFilter}
            onChange={(event) => setLevelFilter(event.target.value)}
          >
            {levels.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            {jobTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>

          <button className="search-jobs-btn" onClick={handleSearch}>
            Search Jobs
          </button>

          <button className="clear-job-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </section>

      <section className="job-board-layout">
        <section className="job-list-panel">
          <div className="job-list-header">
            <div>
              <h2>
                {isLoading
                  ? "Loading jobs..."
                  : `${filteredJobs.length} jobs found`}
              </h2>
              <p>
                Results for <strong>{keyword}</strong> in{" "}
                <strong>{location}</strong>
              </p>
            </div>
          </div>

          {errorMessage && <p className="job-error">{errorMessage}</p>}

          <div className="job-list">
            {filteredJobs.map((job) => (
              <button
                key={job.id}
                className={
                  selectedJob?.id === job.id
                    ? "job-list-item active"
                    : "job-list-item"
                }
                onClick={() => setSelectedJob(job)}
              >
                <div className="job-list-main">
                  <h3>{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                  <p className="job-meta-line">
                    {job.location} • {job.type} • {job.level}
                  </p>

                  <p className="job-short-description">
                    {shortenText(job.description)}
                  </p>

                  <div className="job-badges">
                    <span>{job.category}</span>
                    {job.salary && <span>{job.salary}</span>}
                    <span>{job.source || "Live Jobs"}</span>
                  </div>
                </div>

                <div className="job-list-side">
                  <span>{job.postedDate || "Recently posted"}</span>
                </div>
              </button>
            ))}

            {!isLoading && filteredJobs.length === 0 && (
              <div className="empty-jobs-message">
                <h3>No jobs found</h3>
                <p>Try changing the keyword, location, or filters.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="job-detail-panel">
          {selectedJob && organizedJob ? (
            <div className="job-detail-card">
              <div className="job-detail-top">
                <div>
                  <p className="details-label">Selected Job</p>
                  <h2>{selectedJob.title}</h2>
                  <h3>{selectedJob.company}</h3>
                  <p>{selectedJob.location}</p>
                </div>

                <a
                  className={
                    selectedJob.applyUrl && selectedJob.applyUrl !== "#"
                      ? "apply-btn detail-apply-btn"
                      : "apply-btn disabled-apply-btn"
                  }
                  href={selectedJob.applyUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  {selectedJob.applyUrl && selectedJob.applyUrl !== "#"
                    ? "Apply Now"
                    : "Application Link Missing"}
                </a>
              </div>

              <div className="details-tags">
                <span>{selectedJob.category}</span>
                <span>{selectedJob.level}</span>
                <span>{selectedJob.type}</span>
                <span>{selectedJob.source || "Live Jobs"}</span>
              </div>

              {selectedJob.salary && (
                <p className="details-salary">{selectedJob.salary}</p>
              )}

              <div className="job-info-grid">
                <div>
                  <span>Company</span>
                  <strong>{selectedJob.company}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>{selectedJob.location}</strong>
                </div>

                <div>
                  <span>Type</span>
                  <strong>{selectedJob.type}</strong>
                </div>

                <div>
                  <span>Posted</span>
                  <strong>{selectedJob.postedDate || "Recently posted"}</strong>
                </div>
              </div>

              <div className="details-section">
                <h4>Overview</h4>
                <p>{organizedJob.overview}</p>
              </div>

              {organizedJob.responsibilities && (
                <div className="details-section">
                  <h4>Responsibilities</h4>
                  <p>{organizedJob.responsibilities}</p>
                </div>
              )}

              {organizedJob.qualifications && (
                <div className="details-section">
                  <h4>Qualifications</h4>
                  <p>{organizedJob.qualifications}</p>
                </div>
              )}

              <details className="full-description-toggle">
                <summary>View full job description</summary>
                <p>{organizedJob.fullDescription}</p>
              </details>

              <div className="details-action-row">
                <a
                  className={
                    selectedJob.applyUrl && selectedJob.applyUrl !== "#"
                      ? "apply-btn"
                      : "apply-btn disabled-apply-btn"
                  }
                  href={selectedJob.applyUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  Apply Now
                </a>

                <button className="save-btn">Save Job</button>
              </div>
            </div>
          ) : (
            <div className="job-detail-card">
              <h2>Select a job</h2>
              <p>Click a job from the list to view the full details.</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}