import { useEffect, useState } from "react";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  state: string;
  remote: string;
  link: string;
  dateAdded: string;
};

export default function JobOpenings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [stateFilter, setStateFilter] = useState("All");

  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    state: "Iowa",
    remote: "Yes",
    link: "",
    dateAdded: "",
  });

  useEffect(() => {
    const savedJobs = localStorage.getItem("pivotJobs");

    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }
  }, []);

  function saveJobs(updatedJobs: Job[]) {
    setJobs(updatedJobs);
    localStorage.setItem("pivotJobs", JSON.stringify(updatedJobs));
  }

  function addJob(e: React.FormEvent) {
    e.preventDefault();

    if (!newJob.title || !newJob.company || !newJob.link) {
      alert("Please add job title, company, and link.");
      return;
    }

    const jobToAdd = {
      id: Date.now(),
      ...newJob,
    };

    saveJobs([jobToAdd, ...jobs]);

    setNewJob({
      title: "",
      company: "",
      location: "",
      state: "Iowa",
      remote: "Yes",
      link: "",
      dateAdded: "",
    });

    setShowForm(false);
  }

  function deleteJob(jobId: number) {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    saveJobs(updatedJobs);
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.company.toLowerCase().includes(searchText.toLowerCase());

    const matchesState = stateFilter === "All" || job.state === stateFilter;

    return matchesSearch && matchesState;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Job Openings</h1>
          <p>Weekly jobs researched from Indeed and state job boards.</p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Add Job"}
        </button>
      </div>

      {showForm && (
        <form className="form-grid" onSubmit={addJob}>
          <input
            type="text"
            placeholder="Job Title"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          />

          <input
            type="text"
            placeholder="Company"
            value={newJob.company}
            onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
          />

          <input
            type="text"
            placeholder="Location"
            value={newJob.location}
            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
          />

          <select
            value={newJob.state}
            onChange={(e) => setNewJob({ ...newJob, state: e.target.value })}
          >
            <option>Iowa</option>
            <option>Tennessee</option>
            <option>Louisiana</option>
          </select>

          <select
            value={newJob.remote}
            onChange={(e) => setNewJob({ ...newJob, remote: e.target.value })}
          >
            <option>Yes</option>
            <option>No</option>
            <option>Hybrid</option>
          </select>

          <input
            type="text"
            placeholder="Application Link"
            value={newJob.link}
            onChange={(e) => setNewJob({ ...newJob, link: e.target.value })}
          />

          <input
            type="date"
            value={newJob.dateAdded}
            onChange={(e) =>
              setNewJob({ ...newJob, dateAdded: e.target.value })
            }
          />

          <button type="submit">Save Job</button>
        </form>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by title or company..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option>All</option>
          <option>Iowa</option>
          <option>Tennessee</option>
          <option>Louisiana</option>
        </select>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>State</th>
              <th>Remote</th>
              <th>Date Added</th>
              <th>Apply</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td>{job.state}</td>
                <td>{job.remote}</td>
                <td>{job.dateAdded}</td>
                <td>
                  <a href={job.link} target="_blank">
                    Apply
                  </a>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteJob(job.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredJobs.length === 0 && (
              <tr>
                <td colSpan={8}>No jobs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}