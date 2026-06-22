export default function About() {
  return (
    <section>
      <div className="page-header">
        <div>
          <h1>About Pivot Tech Connect</h1>
          <p className="page-subtitle">
            Pivot Tech Connect is a student and alumni career portal built to
            help Pivot Technology School learners organize job opportunities,
            career resources, and job search progress.
          </p>
        </div>
      </div>

      <div className="hero-card">
        <div>
          <p className="eyebrow">Project Mission</p>
          <h2>Helping students move from training to opportunity.</h2>
          <p>
            This project was created to make the career search process easier,
            cleaner, and more organized for students and alumni entering the
            tech workforce.
          </p>
        </div>
      </div>

      <div className="resource-grid">
        <div className="info-card">
          <h2>Who It Serves</h2>
          <p>
            Pivot students and alumni looking for software development,
            cybersecurity, data analytics, internship, apprenticeship, and
            entry-level technology opportunities.
          </p>
        </div>

        <div className="info-card">
          <h2>What It Does</h2>
          <p>
            Users can add jobs, search opportunities, filter by career track,
            save jobs, apply through job links, and track application status.
          </p>
        </div>

        <div className="info-card">
          <h2>Why It Matters</h2>
          <p>
            Job searching can feel overwhelming. This portal helps students stay
            organized and focused while preparing for the next step in their
            career journey.
          </p>
        </div>

        <div className="info-card">
          <h2>Built With</h2>
          <div className="tag-row">
            <span>React</span>
            <span>TypeScript</span>
            <span>Vite</span>
            <span>LocalStorage</span>
            <span>Vercel</span>
          </div>
        </div>
      </div>

      <div className="info-card">
        <h2>Current Features</h2>

        <div className="checklist-grid">
          <div className="checklist-item">Dashboard</div>
          <div className="checklist-item">Job Openings</div>
          <div className="checklist-item">Add Job Form</div>
          <div className="checklist-item">Search Jobs</div>
          <div className="checklist-item">Job Filters</div>
          <div className="checklist-item">Saved Jobs</div>
          <div className="checklist-item">Application Status</div>
          <div className="checklist-item">Job Details Modal</div>
          <div className="checklist-item">Apply Button</div>
          <div className="checklist-item">Alumni Outreach</div>
          <div className="checklist-item">Career Resources</div>
          <div className="checklist-item">Mobile Menu</div>
        </div>
      </div>
    </section>
  );
}