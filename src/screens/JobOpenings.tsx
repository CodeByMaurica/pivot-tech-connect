import { useEffect, useMemo, useState } from "react";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  level: string;
  type: string;
  salary?: string;
  description: string;
  applyUrl?: string;
  postedDate?: string;
};

const fallbackJobs: Job[] = [
  {
    id: "1",
    title: "Junior Software Developer",
    company: "TechBridge Solutions",
    location: "Remote",
    category: "Software Development",
    level: "Entry Level",
    type: "Full-time",
    salary: "$62,000 - $75,000",
    postedDate: "Today",
    description:
      "Build and maintain React, TypeScript, and API-driven web applications for client-facing platforms.",
    applyUrl: "#",
  },
  {
    id: "2",
    title: "Cybersecurity Analyst Apprentice",
    company: "SecurePath",
    location: "Iowa",
    category: "Cybersecurity",
    level: "Apprenticeship",
    type: "Apprenticeship",
    salary: "$22 - $28/hr",
    postedDate: "1 day ago",
    description:
      "Support security monitoring, incident response, vulnerability reviews, and documentation.",
    applyUrl: "#",
  },
  {
    id: "3",
    title: "Data Analytics Intern",
    company: "InsightWorks",
    location: "Tennessee",
    category: "Data Analytics",
    level: "Internship",
    type: "Internship",
    salary: "$20/hr",
    postedDate: "2 days ago",
    description:
      "Assist with dashboard reporting, SQL queries, Excel analysis, and business intelligence projects.",
    applyUrl: "#",
  },
];

const filters = [
  "Software Development",
  "Cybersecurity",
  "Data Analytics",
  "Iowa",
  "Tennessee",
  "Louisiana",
  "Remote",
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Internship",
  "Apprenticeship",
  "Contract",
];

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";

  return value.replace(/<[^>]*>/g, "").trim();
}

function formatJob(job: any, index: number): Job {
  const companyName =
    typeof job.company === "string"
      ? job.company
      : job.company?.display_name;

  const locationName =
    typeof job.location === "string"
      ? job.location
      : job.location?.display_name;

  const categoryName =
    typeof job.category === "string"
      ? job.category
      : job.category?.label;

  return {
    id: String(job.id ?? job.job_id ?? job.slug ?? index + 1),
    title: cleanText(job.title ?? job.job_title ?? job.name) || "Untitled Job",
    company:
      cleanText(
        companyName ??
          job.company_name ??
          job.companyName ??
          job.employer
      ) || "Unknown Company",
    location:
      cleanText(
        locationName ??
          job.job_location ??
          job.candidate_required_location ??
          job.city
      ) || "Remote",
    category:
      cleanText(categoryName ?? job.job_category ?? job.industry) ||
      "Technology",
    level:
      cleanText(job.level ?? job.seniority ?? job.experience_level) ||
      "Entry Level",
    type:
      cleanText(job.type ?? job.job_type ?? job.employment_type) ||
      cleanText(job.contract_time ?? job.contract_type) ||
      "Full-time",
    salary:
      cleanText(job.salary ?? job.salary_range ?? job.compensation) ||
      (job.salary_min && job.salary_max
        ? `$${Math.round(job.salary_min).toLocaleString()} - $${Math.round(
            job.salary_max
          ).toLocaleString()}`
        : ""),
    description:
      cleanText(
        job.description ?? job.job_description ?? job.snippet ?? job.summary
      ) || "No description available.",
    applyUrl:
      job.applyUrl ??
      job.apply_url ??
      job.job_apply_link ??
      job.apply_link ??
      job.redirect_url ??
      job.application_url ??
      job.url ??
      job.job_url ??
      "#",
    postedDate:
      cleanText(
        job.postedDate ??
          job.posted_date ??
          job.publication_date ??
          job.created_at ??
          job.created
      ) || "Recently posted",
  };
}

export default function JobOpenings() {
  const [jobs, setJobs] = useState<Job[]>(fallbackJobs);
  const [selectedJob, setSelectedJob] = useState<Job>(fallbackJobs[0]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await fetch(
          `/api/jobs?keyword=${encodeURIComponent(
            debouncedSearch || "software developer"
          )}&location=${encodeURIComponent("United States")}`
        );

        if (!response.ok) {
          throw new Error("Jobs API failed");
        }

        const data = await response.json();

        const rawJobs = Array.isArray(data) ? data : [];

        const formattedJobs = rawJobs.map((job: any, index: number) =>
          formatJob(job, index)
        );

        if (formattedJobs.length > 0) {
          setJobs(formattedJobs);
          setSelectedJob(formattedJobs[0]);
        } else {
          setJobs(fallbackJobs);
          setSelectedJob(fallbackJobs[0]);
        }
      } catch (error) {
        console.error("Job loading error:", error);
        setJobs(fallbackJobs);
        setSelectedJob(fallbackJobs[0]);
      }
    }

    loadJobs();
  }, [debouncedSearch]);

  function toggleFilter(filter: string) {
    setActiveFilters((currentFilters) =>
      currentFilters.includes(filter)
        ? currentFilters.filter((item) => item !== filter)
        : [...currentFilters, filter]
    );
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchableText = `
        ${job.title}
        ${job.company}
        ${job.location}
        ${job.category}
        ${job.level}
        ${job.type}
      `.toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());

      const matchesFilters =
        activeFilters.length === 0 ||
        activeFilters.some((filter) =>
          searchableText.includes(filter.toLowerCase())
        );

      return matchesSearch && matchesFilters;
    });
  }, [jobs, searchTerm, activeFilters]);

  return (
    <main className="jobs-page">
      <section className="jobs-header">
        <div>
          <p className="eyebrow">Pivot Tech Connect</p>
          <h1>Job Openings</h1>
          <p>
            Discover software, cybersecurity, data, internship, apprenticeship,
            and remote opportunities.
          </p>
        </div>
      </section>

      <section className="jobs-search-panel">
        <div className="filter-toggle-row">
          <button
            className="filter-menu-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            ☰ Filters
          </button>

          {activeFilters.length > 0 && (
            <button
              className="clear-filters-btn top-clear-btn"
              onClick={() => setActiveFilters([])}
            >
              Clear filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="top-filter-list">
            {filters.map((filter) => (
              <button
                key={filter}
                className={
                  activeFilters.includes(filter)
                    ? "filter-pill active"
                    : "filter-pill"
                }
                onClick={() => toggleFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        <div className="jobs-search-box centered-search">
          <input
            type="text"
            placeholder="Search jobs, companies, skills, or locations"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </section>

      <section className="jobs-layout no-sidebar-layout">
        <section className="jobs-results">
          <div className="results-topbar">
            <div>
              <h2>{filteredJobs.length} jobs found</h2>
              <p>Showing best matches for Pivot Tech students and alumni.</p>
            </div>
          </div>

          <div className="job-row-list">
            {filteredJobs.map((job) => (
              <button
                key={job.id}
                className={
                  selectedJob?.id === job.id ? "job-row selected" : "job-row"
                }
                onClick={() => setSelectedJob(job)}
              >
                <div className="job-row-main">
                  <h3>{job.title}</h3>
                  <p className="company-name">{job.company}</p>
                  <p className="job-meta">
                    {job.location} • {job.level} • {job.type}
                  </p>
                  <p className="job-preview">{job.description}</p>
                </div>

                <div className="job-row-side">
                  <span>{job.postedDate || "Recently posted"}</span>
                  {job.salary && <strong>{job.salary}</strong>}
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="job-details-panel">
          {selectedJob ? (
            <div className="details-card">
              <p className="details-label">Selected Job</p>
              <h2>{selectedJob.title}</h2>
              <h3>{selectedJob.company}</h3>

              <div className="details-tags">
                <span>{selectedJob.location}</span>
                <span>{selectedJob.category}</span>
                <span>{selectedJob.level}</span>
                <span>{selectedJob.type}</span>
              </div>

              {selectedJob.salary && (
                <p className="details-salary">{selectedJob.salary}</p>
              )}

              <div className="details-section">
                <h4>Job Description</h4>
                <p>{selectedJob.description}</p>
              </div>

              <div className="details-section">
                <h4>Why this matches Pivot Tech</h4>
                <p>
                  This opportunity matches career pathways for students and
                  alumni building skills in software, data, cybersecurity, and
                  modern technology careers.
                </p>
              </div>

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
                {selectedJob.applyUrl && selectedJob.applyUrl !== "#"
                  ? "Apply Now"
                  : "Application Link Missing"}
              </a>

              <button className="save-btn">Save Job</button>
            </div>
          ) : (
            <div className="details-card">
              <h2>Select a job</h2>
              <p>Click a job row to view full details here.</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}