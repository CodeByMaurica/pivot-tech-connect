import { useEffect, useState } from "react";

type Job = {
  id: number;
  dateAdded: string;
};

type Alumni = {
  id: number;
  status: string;
  needsSupport: string;
};

export default function Dashboard() {
  const [jobsThisWeek, setJobsThisWeek] = useState(0);
  const [alumniContacted, setAlumniContacted] = useState(0);
  const [alumniEmployed, setAlumniEmployed] = useState(0);
  const [seekingEmployment, setSeekingEmployment] = useState(0);
  const [followUpsNeeded, setFollowUpsNeeded] = useState(0);

  useEffect(() => {
    const jobs: Job[] = JSON.parse(localStorage.getItem("pivotJobs") || "[]");
    const alumni: Alumni[] = JSON.parse(
      localStorage.getItem("pivotAlumni") || "[]"
    );

    setJobsThisWeek(jobs.length);
    setAlumniContacted(alumni.length);
    setAlumniEmployed(
      alumni.filter((person) => person.status === "Employed").length
    );
    setSeekingEmployment(
      alumni.filter((person) => person.status === "Seeking Employment").length
    );
    setFollowUpsNeeded(
      alumni.filter((person) => person.needsSupport === "Yes").length
    );
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <p className="dashboard-subtitle">
        Quick summary of job research and alumni outreach.
      </p>

      <button className="primary-btn" onClick={() => window.print()}>
        Print / Save Report
      </button>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>{jobsThisWeek}</h2>
          <p>Jobs Added This Week</p>
        </div>

        <div className="stat-card">
          <h2>{alumniContacted}</h2>
          <p>Alumni Contacted</p>
        </div>

        <div className="stat-card">
          <h2>{alumniEmployed}</h2>
          <p>Alumni Employed</p>
        </div>

        <div className="stat-card">
          <h2>{seekingEmployment}</h2>
          <p>Seeking Employment</p>
        </div>

        <div className="stat-card">
          <h2>{followUpsNeeded}</h2>
          <p>Follow-Ups Needed</p>
        </div>
      </div>
    </div>
  );
}