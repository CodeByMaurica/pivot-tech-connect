export default function Resources() {
  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Career Resources</h1>
          <p className="page-subtitle">
            Tools and guidance to help Pivot students and alumni prepare for
            software development, cybersecurity, and data analytics roles.
          </p>
        </div>
      </div>

      <div className="hero-card">
        <div>
          <p className="eyebrow">Career Preparation</p>
          <h2>Get ready before you apply.</h2>
          <p>
            A strong resume, LinkedIn profile, GitHub, portfolio, and interview
            story can help students stand out during the job search.
          </p>
        </div>
      </div>

      <div className="resource-grid">
        <div className="info-card">
          <h2>Resume Building</h2>
          <p>
            Focus your resume on projects, tools, skills, and results. Include
            React, TypeScript, APIs, GitHub, deployment links, and your Pivot
            training.
          </p>
        </div>

        <div className="info-card">
          <h2>LinkedIn Optimization</h2>
          <p>
            Add a professional headline, strong About section, featured projects,
            Pivot Technology School experience, and open-to-work job titles.
          </p>
        </div>

        <div className="info-card">
          <h2>GitHub Portfolio</h2>
          <p>
            Keep your repositories organized with clean README files, screenshots,
            project descriptions, and live demo links.
          </p>
        </div>

        <div className="info-card">
          <h2>Interview Preparation</h2>
          <p>
            Practice explaining your projects, bugs you fixed, tools you used,
            and how you solve problems step by step.
          </p>
        </div>
      </div>

      <div className="info-card">
        <h2>Job Search Checklist</h2>

        <div className="checklist-grid">
          <div className="checklist-item">Update resume</div>
          <div className="checklist-item">Update LinkedIn</div>
          <div className="checklist-item">Clean up GitHub</div>
          <div className="checklist-item">Add portfolio projects</div>
          <div className="checklist-item">Apply to entry-level jobs</div>
          <div className="checklist-item">Track applications</div>
          <div className="checklist-item">Practice interviews</div>
          <div className="checklist-item">Follow up weekly</div>
        </div>
      </div>

      <div className="resource-grid">
        <div className="info-card">
          <h2>Software Development</h2>
          <p>
            Practice React, TypeScript, REST APIs, Node.js basics, GitHub, and
            deployment with Vercel.
          </p>
        </div>

        <div className="info-card">
          <h2>Cybersecurity</h2>
          <p>
            Learn basic security terms, networking basics, SOC analyst tasks,
            ticketing, alerts, and documentation.
          </p>
        </div>

        <div className="info-card">
          <h2>Data Analytics</h2>
          <p>
            Practice Excel, SQL, dashboards, charts, reporting, and explaining
            insights from data.
          </p>
        </div>

        <div className="info-card">
          <h2>Professional Skills</h2>
          <p>
            Build communication, problem-solving, teamwork, documentation, and
            follow-through habits.
          </p>
        </div>
      </div>
    </section>
  );
}