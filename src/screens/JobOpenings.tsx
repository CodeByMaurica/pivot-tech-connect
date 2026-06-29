import { useEffect, useState } from "react";
import { getRealJobs, type Job } from "../services/jobsApi";

const starterJobs: Job[] = [
  {
    id: "sample-1",
    title: "Entry Level Software Developer",
    company: "Pivot Career Partner",
    location: "Des Moines",
    state: "Iowa",
    category: "Software Development",
    workType: "Hybrid",
    level: "Entry Level",
    opportunityType: "Full-Time",
    salary: "$55,000 - $70,000",
    link: "https://www.linkedin.com/jobs",
    description:
      "Build web applications using React, TypeScript, APIs, and GitHub.",
    source: "Sample",
    datePosted: "",
    applicationStatus: "Not Applied",
  },
];

export default function JobOpenings() {
  const [jobs, setJobs] = useState<Job[]>(starterJobs);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobError, setJobError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [workTypeFilter, setWorkTypeFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    state: "Iowa",
    category: "Software Development",
    workType: "Remote",
    level: "Entry Level",
    opportunityType: "Full-Time",
    salary: "",
    link: "",
    description: "",
  });

  useEffect(() => {
    const storedSavedJobs = localStorage.getItem("pivotSavedJobs");

    if (storedSavedJobs) {
      setSavedJobs(JSON.parse(storedSavedJobs));
    }

    loadRealJobs();
  }, []);

  useEffect(() => {
    localStorage.setItem("pivotSavedJobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  async function loadRealJobs() {
    try {
      setLoadingJobs(true);
      setJobError("");

      const realJobs = await getRealJobs();

      const jobsWithStatus = realJobs.map((job) => ({
        ...job,
        applicationStatus: job.applicationStatus || "Not Applied",
      }));

      setJobs(jobsWithStatus.length > 0 ? jobsWithStatus : starterJobs);
    } catch (error) {
      setJobError("Real jobs could not load yet. Showing sample jobs.");
      setJobs(starterJobs);
    } finally {
      setLoadingJobs(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addJob(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newJob: Job = {
      id: `manual-${Date.now()}`,
      ...form,
      source: "Manual",
      datePosted: new Date().toISOString(),
      applicationStatus: "Not Applied",
    };

    setJobs([newJob, ...jobs]);

    setForm({
      title: "",
      company: "",
      location: "",
      state: "Iowa",
      category: "Software Development",
      workType: "Remote",
      level: "Entry Level",
      opportunityType: "Full-Time",
      salary: "",
      link: "",
      description: "",
    });
  }

  function deleteJob(id: string) {
    setJobs(jobs.filter((job) => job.id !== id));
    setSavedJobs(savedJobs.filter((job) => job.id !== id));
  }

  function toggleSaveJob(job: Job) {
    const alreadySaved = savedJobs.some((savedJob) => savedJob.id === job.id);

    if (alreadySaved) {
      setSavedJobs(savedJobs.filter((savedJob) => savedJob.id !== job.id));
    } else {
      setSavedJobs([job, ...savedJobs]);
    }
  }

  function isJobSaved(id: string) {
    return savedJobs.some((job) => job.id === id);
  }

  function updateApplicationStatus(id: string, status: string) {
    setJobs(
      jobs.map((job) =>
        job.id === id ? { ...job, applicationStatus: status } : job
      )
    );

    setSavedJobs(
      savedJobs.map((job) =>
        job.id === id ? { ...job, applicationStatus: status } : job
      )
    );

    if (selectedJob?.id === id) {
      setSelectedJob({ ...selectedJob, applicationStatus: status });
    }
  }

  function printReport() {
    window.print();
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || job.category === categoryFilter;

    const matchesState = stateFilter === "All" || job.state === stateFilter;

    const matchesWorkType =
      workTypeFilter === "All" || job.workType === workTypeFilter;

    const matchesLevel = levelFilter === "All" || job.level === levelFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesState &&
      matchesWorkType &&
      matchesLevel
    );
  });

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Job Openings</h1>
          <p className="page-subtitle">
            Search real jobs from Iowa, Tennessee, and Louisiana. Save jobs,
            apply, and track application status.
          </p>
        </div>

        <button className="print-btn" onClick={printReport}>
          Print Report
        </button>
      </div>

      <div className="info-card">
        <h2>Real Job Feed</h2>
        <p>
          Jobs are pulled from the live job API for Software Development,
          Cybersecurity, and Data Analytics.
        </p>

        <button onClick={loadRealJobs}>
          {loadingJobs ? "Loading Jobs..." : "Refresh Real Jobs"}
        </button>

        {jobError && <p>{jobError}</p>}
      </div>

      <div className="info-card">
        <h2>Add Job Manually</h2>

        <form className="job-form" onSubmit={addJob}>
          <input
            name="title"
            placeholder="Job title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="City or Remote"
            value={form.location}
            onChange={handleChange}
            required
          />

          <select name="state" value={form.state} onChange={handleChange}>
            <option>Iowa</option>
            <option>Tennessee</option>
            <option>Louisiana</option>
            <option>Remote</option>
          </select>

          <select name="category" value={form.category} onChange={handleChange}>
            <option>Software Development</option>
            <option>Cybersecurity</option>
            <option>Data Analytics</option>
          </select>

          <select name="workType" value={form.workType} onChange={handleChange}>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-Site</option>
          </select>

          <select name="level" value={form.level} onChange={handleChange}>
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior Level</option>
            <option>Internship</option>
            <option>Apprenticeship</option>
          </select>

          <select
            name="opportunityType"
            value={form.opportunityType}
            onChange={handleChange}
          >
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Internship</option>
            <option>Apprenticeship</option>
            <option>Contract</option>
          </select>

          <input
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
          />

          <input
            name="link"
            placeholder="Application link"
            value={form.link}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Job description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <button type="submit">Add Job</button>
        </form>
      </div>

      <div className="info-card">
        <h2>Search & Filters</h2>

        <div className="filters-grid">
          <input
            placeholder="Search jobs, companies, locations, or tracks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>All</option>
            <option>Software Development</option>
            <option>Cybersecurity</option>
            <option>Data Analytics</option>
          </select>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option>All</option>
            <option>Iowa</option>
            <option>Tennessee</option>
            <option>Louisiana</option>
            <option>Remote</option>
          </select>

          <select
            value={workTypeFilter}
            onChange={(e) => setWorkTypeFilter(e.target.value)}
          >
            <option>All</option>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-Site</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option>All</option>
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior Level</option>
            <option>Internship</option>
            <option>Apprenticeship</option>
          </select>
        </div>
      </div>

      <div className="info-card">
        <h2>Saved Jobs ({savedJobs.length})</h2>

        {savedJobs.length === 0 ? (
          <p>No saved jobs yet.</p>
        ) : (
          <div className="job-grid">
            {savedJobs.map((job) => (
              <div className="job-card" key={job.id}>
                <h3>{job.title}</h3>
                <p className="company">{job.company}</p>
                <p>
                  {job.location}, {job.state}
                </p>

                <div className="tag-row">
                  <span>{job.category}</span>
                  <span>{job.applicationStatus || "Not Applied"}</span>
                </div>

                <div className="card-actions">
                  <button onClick={() => setSelectedJob(job)}>Details</button>
                  <button onClick={() => toggleSaveJob(job)}>Unsave</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {loadingJobs ? (
        <div className="info-card">
          <h2>Loading real jobs...</h2>
          <p>Please wait while new job openings load.</p>
        </div>
      ) : (
        <div className="job-grid">
          {filteredJobs.map((job) => (
            <div className="job-card" key={job.id}>
              <h3>{job.title}</h3>
              <p className="company">{job.company}</p>
              <p>
                {job.location}, {job.state}
              </p>

              <div className="tag-row">
                <span>{job.category}</span>
                <span>{job.workType}</span>
                <span>{job.level}</span>
                <span>{job.opportunityType}</span>
                <span>{job.applicationStatus || "Not Applied"}</span>
              </div>

              <p className="salary">{job.salary}</p>

              <select
                value={job.applicationStatus || "Not Applied"}
                onChange={(e) => updateApplicationStatus(job.id, e.target.value)}
              >
                <option>Not Applied</option>
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Offer Received</option>
                <option>Not Selected</option>
              </select>

              <div className="card-actions">
                <button onClick={() => setSelectedJob(job)}>Details</button>

                {job.link && (
                  <a href={job.link} target="_blank" rel="noreferrer">
                    <button>Apply</button>
                  </a>
                )}

                <button onClick={() => toggleSaveJob(job)}>
                  {isJobSaved(job.id) ? "Unsave" : "Save"}
                </button>

                <button className="delete-btn" onClick={() => deleteJob(job.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredJobs.length === 0 && !loadingJobs && (
        <div className="info-card">
          <h2>No jobs found</h2>
          <p>Try changing your search or filters.</p>
        </div>
      )}

      {selectedJob && (
        <div className="modal-backdrop" onClick={() => setSelectedJob(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedJob.title}</h2>

            <p>
              <strong>Company:</strong> {selectedJob.company}
            </p>

            <p>
              <strong>Location:</strong> {selectedJob.location},{" "}
              {selectedJob.state}
            </p>

            <p>
              <strong>Career Track:</strong> {selectedJob.category}
            </p>

            <p>
              <strong>Work Type:</strong> {selectedJob.workType}
            </p>

            <p>
              <strong>Level:</strong> {selectedJob.level}
            </p>

            <p>
              <strong>Opportunity Type:</strong> {selectedJob.opportunityType}
            </p>

            <p>
              <strong>Application Status:</strong>{" "}
              {selectedJob.applicationStatus || "Not Applied"}
            </p>

            <p>
              <strong>Salary:</strong> {selectedJob.salary || "Not listed"}
            </p>

            <p>
              <strong>Source:</strong> {selectedJob.source}
            </p>

            <p>{selectedJob.description}</p>

            <select
              value={selectedJob.applicationStatus || "Not Applied"}
              onChange={(e) =>
                updateApplicationStatus(selectedJob.id, e.target.value)
              }
            >
              <option>Not Applied</option>
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Offer Received</option>
              <option>Not Selected</option>
            </select>

            <div className="card-actions">
              {selectedJob.link ? (
                <a href={selectedJob.link} target="_blank" rel="noreferrer">
                  <button>Apply</button>
                </a>
              ) : (
                <button disabled>No Link</button>
              )}

              <button onClick={() => toggleSaveJob(selectedJob)}>
                {isJobSaved(selectedJob.id) ? "Unsave" : "Save"}
              </button>

              <button onClick={() => setSelectedJob(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}