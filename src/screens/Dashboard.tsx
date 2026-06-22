export default function Dashboard() {
  const jobs = JSON.parse(localStorage.getItem("pivotJobs") || "[]");
  const savedJobs = JSON.parse(localStorage.getItem("pivotSavedJobs") || "[]");
  const alumni = JSON.parse(localStorage.getItem("pivotAlumni") || "[]");

  const softwareJobs = jobs.filter(
    (job: any) => job.category === "Software Development"
  );

  const cyberJobs = jobs.filter((job: any) => job.category === "Cybersecurity");

  const dataJobs = jobs.filter((job: any) => job.category === "Data Analytics");

  const remoteJobs = jobs.filter((job: any) => job.workType === "Remote");

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">
            Welcome to Pivot Tech Connect — a student and alumni career portal
            built for Pivot Technology School.
          </p>
        </div>
      </div>

      <div className="hero-card">
        <div>
          <p className="eyebrow">Career Portal</p>
          <h2>Connect students and alumni to real tech opportunities.</h2>
          <p>
            Track jobs, save opportunities, review career resources, and support
            alumni job search progress in one simple place.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>{jobs.length}</h2>
          <p>Total Jobs</p>
        </div>

        <div className="stat-card">
          <h2>{savedJobs.length}</h2>
          <p>Saved Jobs</p>
        </div>

        <div className="stat-card">
          <h2>{remoteJobs.length}</h2>
          <p>Remote Jobs</p>
        </div>

        <div className="stat-card">
          <h2>{alumni.length}</h2>
          <p>Alumni Records</p>
        </div>
      </div>

      <div className="resource-grid">
        <div className="info-card">
          <h2>Software Development</h2>
          <p>
            {softwareJobs.length} jobs saved for students learning React,
            TypeScript, APIs, and full-stack development.
          </p>
        </div>

        <div className="info-card">
          <h2>Cybersecurity</h2>
          <p>
            {cyberJobs.length} opportunities for students interested in security
            monitoring, help desk, SOC, and analyst roles.
          </p>
        </div>

        <div className="info-card">
          <h2>Data Analytics</h2>
          <p>
            {dataJobs.length} opportunities for students learning Excel, SQL,
            dashboards, reporting, and data tools.
          </p>
        </div>

        <div className="info-card">
          <h2>Career Support</h2>
          <p>
            Use the portal to organize job leads, saved opportunities, alumni
            follow-ups, and career preparation resources.
          </p>
        </div>
      </div>
    </section>
  );
}