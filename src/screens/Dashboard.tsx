type Job = {
  id: string;
  title: string;
  company: string;
  location?: string;
  category?: string;
  level?: string;
  type?: string;
  salary?: string;
  source?: string;
  postedDate?: string;
};

function getStoredJobs(key: string): Job[] {
  const value = localStorage.getItem(key);

  if (!value) return [];

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const savedJobs = getStoredJobs("pivotSavedJobs");
  const appliedJobs = getStoredJobs("pivotAppliedJobs");
  const interviewingJobs = getStoredJobs("pivotInterviewingJobs");
  const offerJobs = getStoredJobs("pivotOfferJobs");

  const totalTracked =
    savedJobs.length +
    appliedJobs.length +
    interviewingJobs.length +
    offerJobs.length;

  const latestJobs = [
    ...savedJobs,
    ...appliedJobs,
    ...interviewingJobs,
    ...offerJobs,
  ].slice(0, 5);

  return (
    <main className="student-dashboard-page">
      <section className="dashboard-hero">
        <p className="eyebrow">Pivot Tech Connect</p>
        <h1>Student Career Dashboard</h1>
        <p>
          Track job progress, resume readiness, interview prep, and career
          momentum in one place.
        </p>
      </section>

      <section className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <span>Saved Jobs</span>
          <strong>{savedJobs.length}</strong>
          <p>Jobs students want to revisit.</p>
        </div>

        <div className="dashboard-stat-card">
          <span>Applied</span>
          <strong>{appliedJobs.length}</strong>
          <p>Applications submitted.</p>
        </div>

        <div className="dashboard-stat-card">
          <span>Interviewing</span>
          <strong>{interviewingJobs.length}</strong>
          <p>Active interview opportunities.</p>
        </div>

        <div className="dashboard-stat-card">
          <span>Offers</span>
          <strong>{offerJobs.length}</strong>
          <p>Offer-stage opportunities.</p>
        </div>
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-panel">
          <h2>Career Progress</h2>

          <div className="progress-item">
            <div>
              <strong>Job Search Tracker</strong>
              <span>{totalTracked} tracked jobs</span>
            </div>
            <progress value={Math.min(totalTracked, 10)} max="10" />
          </div>

          <div className="progress-item">
            <div>
              <strong>Resume Builder</strong>
              <span>Ready for ATS resume generation</span>
            </div>
            <progress value="75" max="100" />
          </div>

          <div className="progress-item">
            <div>
              <strong>LinkedIn Optimization</strong>
              <span>Connected to resume builder</span>
            </div>
            <progress value="65" max="100" />
          </div>

          <div className="progress-item">
            <div>
              <strong>Interview Prep</strong>
              <span>Practice answers and improve responses</span>
            </div>
            <progress value="55" max="100" />
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>Latest Tracked Jobs</h2>

          {latestJobs.length > 0 ? (
            <div className="dashboard-job-list">
              {latestJobs.map((job) => (
                <div key={job.id} className="dashboard-job-item">
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                  <span>
                    {job.location || "Remote"} • {job.type || "Full-time"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <h3>No tracked jobs yet</h3>
              <p>
                Go to Job Openings and save jobs, mark applied, or move jobs to
                interviewing.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-action-grid">
        <a href="/jobs" className="dashboard-action-card">
          <h3>Find Jobs</h3>
          <p>Search live software, cyber, data, internship, and remote jobs.</p>
        </a>

        <a href="/resources" className="dashboard-action-card">
          <h3>Build Resume</h3>
          <p>Create an ATS resume and connect it to LinkedIn and GitHub.</p>
        </a>

        <a href="/resources" className="dashboard-action-card">
          <h3>Practice Interview</h3>
          <p>Answer interview questions and improve your responses.</p>
        </a>
      </section>
    </main>
  );
}