import { useMemo, useState } from "react";

type ResourceTab =
  | "Resume Builder"
  | "LinkedIn Optimization"
  | "GitHub Portfolio"
  | "Interview Prep"
  | "Career Roadmap"
  | "Salary Explorer"
  | "Certifications";

type SavedJob = {
  id: string;
  title: string;
  company: string;
  description: string;
  category?: string;
  level?: string;
  type?: string;
  salary?: string;
  location?: string;
};

const tabs: ResourceTab[] = [
  "Resume Builder",
  "LinkedIn Optimization",
  "GitHub Portfolio",
  "Interview Prep",
  "Career Roadmap",
  "Salary Explorer",
  "Certifications",
];

const skillsBank = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express",
  "REST API",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "Git",
  "GitHub",
  "Vite",
  "HTML",
  "CSS",
  "Python",
  "FastAPI",
  "Docker",
  "AWS",
  "Azure",
  "Firebase",
  "Cybersecurity",
  "SIEM",
  "Linux",
  "Networking",
  "Security+",
  "Incident Response",
  "Data Analytics",
  "Excel",
  "Power BI",
  "Tableau",
  "Pandas",
  "Dashboard",
  "Testing",
  "Agile",
  "CI/CD",
  "Frontend",
  "Backend",
  "Full Stack",
];

function getStoredJobs(): SavedJob[] {
  const keys = [
    "pivotSavedJobs",
    "pivotAppliedJobs",
    "pivotInterviewingJobs",
    "pivotOfferJobs",
  ];

  const allJobs = keys.flatMap((key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  });

  const uniqueJobs = new Map<string, SavedJob>();

  allJobs.forEach((job: SavedJob) => {
    if (job?.id) uniqueJobs.set(job.id, job);
  });

  return Array.from(uniqueJobs.values());
}

function getKeywords(text: string) {
  const lowerText = text.toLowerCase();
  return skillsBank.filter((skill) => lowerText.includes(skill.toLowerCase()));
}

function getAtsScore(resume: string, job: string) {
  const resumeSkills = getKeywords(resume);
  const jobSkills = getKeywords(job);

  const matched = jobSkills.filter((skill) => resumeSkills.includes(skill));
  const missing = jobSkills.filter((skill) => !resumeSkills.includes(skill));

  const score =
    jobSkills.length === 0
      ? 0
      : Math.round((matched.length / jobSkills.length) * 100);

  return { score, matched, missing, jobSkills };
}

function generateOptimizedResume(
  resume: string,
  jobDescription: string,
  targetRole: string
) {
  const ats = getAtsScore(resume, jobDescription);
  const matchedSkills = getKeywords(`${resume} ${jobDescription}`);

  return `PROFESSIONAL SUMMARY
Motivated ${targetRole || "technology professional"} with hands-on experience building projects, solving technical problems, and using modern tools including ${matchedSkills
    .slice(0, 10)
    .join(", ")}.

CORE TECHNICAL SKILLS
${matchedSkills.join(" • ")}

ATS KEYWORDS TO ADD ONLY IF TRUE
${
  ats.missing.length
    ? ats.missing.join(" • ")
    : "No major missing keywords detected."
}

PROJECT EXPERIENCE
Pivot Tech Connect
- Built a career platform using React, TypeScript, Vite, APIs, and localStorage.
- Created live job search, job tracking, saved jobs, applied jobs, interviewing, and offer tracking.
- Built connected career resources including resume generation, LinkedIn optimization, GitHub portfolio guidance, and interview preparation.
- Improved user experience with searchable job listings, filters, job details, and ATS-focused career tools.

Technical Projects
- Developed responsive applications using React, TypeScript, JavaScript, APIs, and modern frontend practices.
- Used GitHub for version control and deployed projects for live portfolio review.
- Practiced debugging, component structure, reusable code, API integration, and user-focused design.

EXPERIENCE
Add real work experience here using bullets focused on communication, customer service, problem-solving, documentation, technical support, teamwork, data entry, and process improvement.

EDUCATION & TRAINING
Pivot Technology School — Software Development with AI
Relevant Training: React, TypeScript, JavaScript, APIs, GitHub, AI tools, software development, and career readiness.`;
}

function generateLinkedIn(resume: string, targetRole: string) {
  const skills = getKeywords(resume).slice(0, 10);

  return {
    headline: `${
      targetRole || "Software Developer"
    } | React • TypeScript • JavaScript • AI Tools • Career-Ready Tech Talent`,
    about: `I am a career-focused technology professional trained in software development with AI through Pivot Technology School. I build practical applications using ${skills.join(
      ", "
    )}. My work focuses on solving real problems, creating clean user experiences, learning quickly, and turning technical training into job-ready projects.`,
    skills,
    featured:
      "Feature your best projects: Pivot Tech Connect, Personal Finance Tracker, AI Resume Analyzer, Task Manager, and any deployed portfolio apps.",
  };
}

function generateGitHub(resume: string) {
  const skills = getKeywords(resume).slice(0, 10);

  return `# GitHub Portfolio README

## About Me
I am a software development student/alumni focused on building real-world applications using ${skills.join(
    ", "
  )}.

## Featured Projects

### Pivot Tech Connect
Career platform for students and alumni featuring live job search, filters, job tracking, resume tools, interview prep, and career resources.

### Personal Finance Tracker
Full-stack finance dashboard for tracking income, expenses, budgets, and financial goals.

### AI Resume Analyzer
AI-style resume tool that compares resumes against job descriptions and improves ATS alignment.

## Tech Stack
${skills.join(" • ")}

## What Employers Will See
- Clean project folders
- Professional README files
- Live demo links
- Screenshots
- Clear setup instructions
- Problem, solution, and results explained`;
}

function improveInterviewAnswer(question: string, answer: string, resume: string) {
  const skills = getKeywords(resume).slice(0, 6);

  return `Question:
${question}

Student Answer:
${answer || "No answer entered yet."}

Stronger Answer:
"In my training and project work, I practiced ${skills.join(
    ", "
  )}. One project I can speak about is Pivot Tech Connect, where I helped build a career platform with job search, saved jobs, applied jobs, resume tools, and interview preparation. I had to think through user experience, data flow, state management, and how to organize job information clearly. That helped me build confidence with troubleshooting, explaining my work, and creating tools that solve real user problems."

Tip:
Use STAR — Situation, Task, Action, Result.`;
}

export default function Resources() {
  const [activeTab, setActiveTab] = useState<ResourceTab>("Resume Builder");
  const [targetRole, setTargetRole] = useState("Software Developer");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedResume, setGeneratedResume] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");

  const [interviewQuestion, setInterviewQuestion] = useState(
    "Tell me about a project you built and what problem it solved."
  );
  const [studentAnswer, setStudentAnswer] = useState("");
  const [improvedAnswer, setImprovedAnswer] = useState("");

  const storedJobs = useMemo(() => getStoredJobs(), []);

  const ats = useMemo(
    () => getAtsScore(generatedResume || resumeText, jobDescription),
    [generatedResume, resumeText, jobDescription]
  );

  const linkedin = useMemo(
    () => generateLinkedIn(generatedResume || resumeText, targetRole),
    [generatedResume, resumeText, targetRole]
  );

  const githubReadme = useMemo(
    () => generateGitHub(generatedResume || resumeText),
    [generatedResume, resumeText]
  );

  function handleResumeUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setResumeText(String(reader.result || ""));
    reader.readAsText(file);
  }

  function handleJobSelect(jobId: string) {
    setSelectedJobId(jobId);

    const job = storedJobs.find((item) => item.id === jobId);

    if (job) {
      setTargetRole(job.title || targetRole);
      setJobDescription(`${job.title}\n${job.company}\n\n${job.description}`);
    }
  }

  function handleGenerateResume() {
    const resume = generateOptimizedResume(
      resumeText,
      jobDescription,
      targetRole
    );

    setGeneratedResume(resume);
  }

  function downloadResumePDF() {
    if (!generatedResume) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Pivot Tech Connect Resume</title>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 40px;
              max-width: 850px;
              margin: 0 auto;
              color: #111827;
              line-height: 1.6;
            }
            h1 {
              color: #0b1f3a;
              border-bottom: 3px solid #f97316;
              padding-bottom: 10px;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h1>Pivot Tech Connect Resume</h1>
          <pre>${generatedResume}</pre>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  function handleImproveAnswer() {
    setImprovedAnswer(
      improveInterviewAnswer(
        interviewQuestion,
        studentAnswer,
        generatedResume || resumeText
      )
    );
  }

  return (
    <main className="resources-page">
      <section className="resources-hero">
        <p className="eyebrow">Career Resources</p>
        <h1>Connected Career Builder</h1>
        <p>
          Build one resume, then automatically power LinkedIn, GitHub portfolio,
          interview prep, salary planning, and career roadmap tools.
        </p>
      </section>

      <section className="resources-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={
              activeTab === tab ? "resource-tab active" : "resource-tab"
            }
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </section>

      {activeTab === "Resume Builder" && (
        <section className="resource-card">
          <h2>ATS Resume Builder</h2>
          <p>
            Upload or paste a resume, select a saved job from the job board, and
            generate a stronger ATS-aligned resume.
          </p>

          <div className="resume-builder-grid">
            <div className="resume-input-panel">
              <label>
                <span>Target Role</span>
                <input
                  value={targetRole}
                  onChange={(event) => setTargetRole(event.target.value)}
                  placeholder="Software Developer, Cybersecurity Analyst, Data Analyst"
                />
              </label>

              <label>
                <span>Select Job From Job Board</span>
                <select
                  value={selectedJobId}
                  onChange={(event) => handleJobSelect(event.target.value)}
                >
                  <option value="">Choose saved/applied/interviewing job</option>
                  {storedJobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} — {job.company}
                    </option>
                  ))}
                </select>
              </label>

              <label className="upload-box">
                <span>Upload Resume</span>
                <input type="file" onChange={handleResumeUpload} />
                <small>Text files work best. You can also paste below.</small>
              </label>

              <label>
                <span>Paste Resume</span>
                <textarea
                  value={resumeText}
                  onChange={(event) => setResumeText(event.target.value)}
                  placeholder="Paste student resume here..."
                />
              </label>
            </div>

            <div className="resume-input-panel">
              <label>
                <span>Job Description</span>
                <textarea
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  placeholder="Select a job from the board or paste a job description..."
                />
              </label>

              <button className="generate-btn" onClick={handleGenerateResume}>
                Generate ATS Resume
              </button>
            </div>
          </div>

          <div className="ats-score-card">
            <div>
              <span>ATS Match Score</span>
              <strong>{ats.score}%</strong>
            </div>
            <div>
              <span>Matched Skills</span>
              <p>{ats.matched.length}</p>
            </div>
            <div>
              <span>Missing Skills</span>
              <p>{ats.missing.length}</p>
            </div>
          </div>

          <div className="keyword-grid">
            <div>
              <h3>Matched Keywords</h3>
              <div className="keyword-list">
                {ats.matched.length ? (
                  ats.matched.map((skill) => <span key={skill}>{skill}</span>)
                ) : (
                  <p>No matched keywords yet.</p>
                )}
              </div>
            </div>

            <div>
              <h3>Missing Keywords</h3>
              <div className="keyword-list missing">
                {ats.missing.length ? (
                  ats.missing.map((skill) => <span key={skill}>{skill}</span>)
                ) : (
                  <p>No missing keywords detected.</p>
                )}
              </div>
            </div>
          </div>

          {generatedResume && (
            <div className="generated-output">
              <h3>Generated Resume</h3>

              <textarea
                value={generatedResume}
                onChange={(event) => setGeneratedResume(event.target.value)}
              />

              <div className="career-action-row">
                <button className="generate-btn" onClick={downloadResumePDF}>
                  Download Resume PDF
                </button>

                <button
                  className="generate-btn"
                  onClick={() => navigator.clipboard.writeText(generatedResume)}
                >
                  Copy Resume
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === "LinkedIn Optimization" && (
        <section className="resource-card">
          <h2>LinkedIn Optimization</h2>
          <p>This updates automatically from the resume builder.</p>

          <div className="resource-output-grid">
            <div>
              <h3>Headline</h3>
              <p>{linkedin.headline}</p>
            </div>

            <div>
              <h3>About Section</h3>
              <p>{linkedin.about}</p>
            </div>

            <div>
              <h3>Skills</h3>
              <div className="keyword-list">
                {linkedin.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div>
              <h3>Featured Section</h3>
              <p>{linkedin.featured}</p>
            </div>
          </div>
        </section>
      )}

      {activeTab === "GitHub Portfolio" && (
        <section className="resource-card">
          <h2>GitHub Portfolio Builder</h2>
          <p>This creates GitHub guidance from the resume and projects.</p>

          <div className="generated-output">
            <h3>Generated GitHub README</h3>
            <textarea value={githubReadme} readOnly />
          </div>
        </section>
      )}

      {activeTab === "Interview Prep" && (
        <section className="resource-card">
          <h2>Interview Prep</h2>
          <p>
            Questions and stronger answers are based on the student resume and
            target role.
          </p>

          <div className="resume-builder-grid">
            <div className="resume-input-panel">
              <label>
                <span>Interview Question</span>
                <select
                  value={interviewQuestion}
                  onChange={(event) => setInterviewQuestion(event.target.value)}
                >
                  <option>
                    Tell me about a project you built and what problem it
                    solved.
                  </option>
                  <option>Why are you interested in this role?</option>
                  <option>
                    Tell me about a time you solved a difficult problem.
                  </option>
                  <option>How do you handle debugging or troubleshooting?</option>
                  <option>What tools and technologies have you used?</option>
                </select>
              </label>

              <label>
                <span>Student Answer</span>
                <textarea
                  value={studentAnswer}
                  onChange={(event) => setStudentAnswer(event.target.value)}
                  placeholder="Student types their answer here..."
                />
              </label>

              <button className="generate-btn" onClick={handleImproveAnswer}>
                Improve My Answer
              </button>
            </div>

            <div className="generated-output">
              <h3>Stronger Interview Response</h3>
              <textarea value={improvedAnswer} readOnly />
            </div>
          </div>
        </section>
      )}

      {activeTab === "Career Roadmap" && (
        <section className="resource-card">
          <h2>Career Roadmap</h2>
          <div className="prep-grid">
            <div>
              <h3>Software Developer</h3>
              <p>
                HTML → CSS → JavaScript → React → TypeScript → APIs → Node.js →
                SQL → Deployment.
              </p>
            </div>
            <div>
              <h3>Cybersecurity</h3>
              <p>
                Networking → Linux → Security+ → SIEM → Incident Response →
                Cloud Security → Labs.
              </p>
            </div>
            <div>
              <h3>Data Analytics</h3>
              <p>
                Excel → SQL → Python → Pandas → Dashboards → Power BI/Tableau →
                Business Insights.
              </p>
            </div>
            <div>
              <h3>Professional Skills</h3>
              <p>
                Communication → Documentation → Problem Solving → Agile →
                Portfolio Presentation.
              </p>
            </div>
          </div>
        </section>
      )}

      {activeTab === "Salary Explorer" && (
        <section className="resource-card">
          <h2>Salary Explorer</h2>
          <div className="prep-grid">
            <div>
              <h3>Junior Software Developer</h3>
              <p>$55,000–$85,000 depending on location, portfolio, and stack.</p>
            </div>
            <div>
              <h3>Cybersecurity Analyst</h3>
              <p>$60,000–$95,000 with labs, Security+, SIEM, and incident response.</p>
            </div>
            <div>
              <h3>Data Analyst</h3>
              <p>$50,000–$80,000 with SQL, Excel, dashboards, and reporting projects.</p>
            </div>
            <div>
              <h3>Full Stack Developer</h3>
              <p>$70,000–$110,000 with React, Node.js, SQL, APIs, and deployments.</p>
            </div>
          </div>
        </section>
      )}

      {activeTab === "Certifications" && (
        <section className="resource-card">
          <h2>Certifications</h2>
          <div className="prep-grid">
            <div>
              <h3>Software Development</h3>
              <p>FreeCodeCamp, Meta Front-End, AWS Cloud Practitioner, Microsoft Azure Fundamentals.</p>
            </div>
            <div>
              <h3>Cybersecurity</h3>
              <p>CompTIA Security+, Google Cybersecurity Certificate, ISC2 CC, TryHackMe labs.</p>
            </div>
            <div>
              <h3>Data Analytics</h3>
              <p>Google Data Analytics, Microsoft Power BI, SQL certificates, Python/Pandas projects.</p>
            </div>
            <div>
              <h3>Professional Readiness</h3>
              <p>LinkedIn Learning, Agile/Scrum basics, GitHub portfolio, resume and interview practice.</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}