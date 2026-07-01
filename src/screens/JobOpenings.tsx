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

type JobStatus = "Saved" | "Applied" | "Interviewing" | "Offer";
type JobTab = "All Jobs" | "Saved" | "Applied" | "Interviewing" | "Offers";

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

  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [interviewingJobs, setInterviewingJobs] = useState<Job[]>([]);
  const [offerJobs, setOfferJobs] = useState<Job[]>([]);

  const [activeTab, setActiveTab] = useState<JobTab>("All Jobs");

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
    const saved = localStorage.getItem("pivotSavedJobs");
    const applied = localStorage.getItem("pivotAppliedJobs");
    const interviewing = localStorage.getItem("pivotInterviewingJobs");
    const offers = localStorage.getItem("pivotOfferJobs");

    setSavedJobs(saved ? JSON.parse(saved) : []);
    setAppliedJobs(applied ? JSON.parse(applied) : []);
    setInterviewingJobs(interviewing ? JSON.parse(interviewing) : []);
    setOfferJobs(offers ? JSON.parse(offers) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem("pivotSavedJobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem("pivotAppliedJobs", JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  useEffect(() => {
    localStorage.setItem(
      "pivotInterviewingJobs",
      JSON.stringify(interviewingJobs)
    );
  }, [interviewingJobs]);

  useEffect(() => {
    localStorage.setItem("pivotOfferJobs", JSON.stringify(offerJobs));
  }, [offerJobs]);

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

  function addJobToList(job: Job, status: JobStatus) {
    if (status === "Saved") {
      setSavedJobs((current) =>
        current.some((item) => item.id === job.id) ? current : [job, ...current]
      );
    }

    if (status === "Applied") {
      setAppliedJobs((current) =>
        current.some((item) => item.id === job.id) ? current : [job, ...current]
      );
    }

    if (status === "Interviewing") {
      setInterviewingJobs((current) =>
        current.some((item) => item.id === job.id) ? current : [job, ...current]
      );
    }

    if (status === "Offer") {
      setOfferJobs((current) =>
        current.some((item) => item.id === job.id) ? current : [job, ...current]
      );
    }
  }

  function removeJobFromCurrentTab(jobId: string) {
    if (activeTab === "Saved") {
      setSavedJobs((current) => current.filter((job) => job.id !== jobId));
    }

    if (activeTab === "Applied") {
      setAppliedJobs((current) => current.filter((job) => job.id !== jobId));
    }

    if (activeTab === "Interviewing") {
      setInterviewingJobs((current) =>
        current.filter((job) => job.id !== jobId)
      );
    }

    if (activeTab === "Offers") {
      setOfferJobs((current) => current.filter((job) => job.id !== jobId));
    }
  }

  function getTabJobs() {
    if (activeTab === "Saved") return savedJobs;
    if (activeTab === "Applied") return appliedJobs;
    if (activeTab === "Interviewing") return interviewingJobs;
    if (activeTab === "Offers") return offerJobs;
    return jobs;
  }

  const tabJobs = getTabJobs();

  const filteredJobs = useMemo(() => {
    return tabJobs.filter((job) => {
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
  }, [tabJobs, categoryFilter, levelFilter, typeFilter]);

  function handleSearch() {
    setActiveTab("All Jobs");
    setKeyword(searchKeyword);
    setLocation(searchLocation);
  }

  function clearFilters() {
    setCategoryFilter("All Categories");
    setLevelFilter("All Levels");
    setTypeFilter("All Types");
  }

  function changeTab(tab: JobTab) {
    setActiveTab(tab);

    const jobsForTab =
      tab === "Saved"
        ? savedJobs
        : tab === "Applied"
        ? appliedJobs
        : tab === "Interviewing"
        ? interviewingJobs
        : tab === "Offers"
        ? offerJobs
        : jobs;

    setSelectedJob(jobsForTab[0] ?? null);
  }

  const organizedJob = selectedJob
    ? organizeDescription(selectedJob.description)
    : null;

  return (
    <main className="jobs-page redesigned-jobs-page">
      <section className="jobs-top-header">
        <div className="jobs-brand">
          <span className="jobs-logo-mark">⚡</span>
          <strong>Pivot Tech Connect</strong>
        </div>

        <nav className="jobs-nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/resources">Resources</a>
          <a href="/login">Sign in</a>
        </nav>
      </section>

      <section className="indeed-style-search">
        <div className="indeed-search-bar">
          <label className="indeed-search-field">
            <span>🔎</span>
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
          </label>

          <div className="indeed-divider" />

          <label className="indeed-search-field">
            <span>📍</span>
            <input
              type="text"
              placeholder="City, state, or remote"
              value={searchLocation}
              onChange={(event) => setSearchLocation(event.target.value)}
            />
          </label>

          <button className="indeed-search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="job-filter-row indeed-filter-row">
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

          <button className="clear-job-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </section>

      <section className="job-tabs-row">
        <button
          className={activeTab === "All Jobs" ? "job-tab active" : "job-tab"}
          onClick={() => changeTab("All Jobs")}
        >
          All Jobs ({jobs.length})
        </button>

        <button
          className={activeTab === "Saved" ? "job-tab active" : "job-tab"}
          onClick={() => changeTab("Saved")}
        >
          Saved ({savedJobs.length})
        </button>

        <button
          className={activeTab === "Applied" ? "job-tab active" : "job-tab"}
          onClick={() => changeTab("Applied")}
        >
          Applied ({appliedJobs.length})
        </button>

        <button
          className={
            activeTab === "Interviewing" ? "job-tab active" : "job-tab"
          }
          onClick={() => changeTab("Interviewing")}
        >
          Interviewing ({interviewingJobs.length})
        </button>

        <button
          className={activeTab === "Offers" ? "job-tab active" : "job-tab"}
          onClick={() => changeTab("Offers")}
        >
          Offers ({offerJobs.length})
        </button>
      </section>

      <section className="job-stats-row">
        <div>
          <span>Total Jobs</span>
          <strong>{jobs.length}</strong>
        </div>

        <div>
          <span>Saved</span>
          <strong>{savedJobs.length}</strong>
        </div>

        <div>
          <span>Applied</span>
          <strong>{appliedJobs.length}</strong>
        </div>

        <div>
          <span>Interviewing</span>
          <strong>{interviewingJobs.length}</strong>
        </div>

        <div>
          <span>Offers</span>
          <strong>{offerJobs.length}</strong>
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
                {activeTab === "All Jobs" ? (
                  <>
                    Results for <strong>{keyword}</strong> in{" "}
                    <strong>{location}</strong>
                  </>
                ) : (
                  <>
                    Showing <strong>{activeTab}</strong> jobs
                  </>
                )}
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
                <p>Try changing the keyword, location, filters, or tab.</p>
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

              <div className="details-action-row job-tracker-actions">
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

                <button
                  className="save-btn"
                  onClick={() => addJobToList(selectedJob, "Saved")}
                >
                  Save Job
                </button>

                <button
                  className="status-btn applied-btn"
                  onClick={() => addJobToList(selectedJob, "Applied")}
                >
                  Mark Applied
                </button>

                <button
                  className="status-btn interviewing-btn"
                  onClick={() => addJobToList(selectedJob, "Interviewing")}
                >
                  Interviewing
                </button>

                <button
                  className="status-btn offer-btn"
                  onClick={() => addJobToList(selectedJob, "Offer")}
                >
                  Offer
                </button>

                {activeTab !== "All Jobs" && (
                  <button
                    className="status-btn remove-btn"
                    onClick={() => removeJobFromCurrentTab(selectedJob.id)}
                  >
                    Remove from {activeTab}
                  </button>
                )}
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