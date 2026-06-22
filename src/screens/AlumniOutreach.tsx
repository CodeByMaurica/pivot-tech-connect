import { useEffect, useState } from "react";

type Alumni = {
  id: number;
  name: string;
  email: string;
  phone: string;
  track: string;
  status: string;
  notes: string;
};

export default function AlumniOutreach() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    track: "Software Development",
    status: "Seeking Employment",
    notes: "",
  });

  useEffect(() => {
    const storedAlumni = localStorage.getItem("pivotAlumni");

    if (storedAlumni) {
      setAlumni(JSON.parse(storedAlumni));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pivotAlumni", JSON.stringify(alumni));
  }, [alumni]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addAlumni(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newAlumni: Alumni = {
      id: Date.now(),
      ...form,
    };

    setAlumni([newAlumni, ...alumni]);

    setForm({
      name: "",
      email: "",
      phone: "",
      track: "Software Development",
      status: "Seeking Employment",
      notes: "",
    });
  }

  function deleteAlumni(id: number) {
    setAlumni(alumni.filter((person) => person.id !== id));
  }

  const seekingEmployment = alumni.filter(
    (person) => person.status === "Seeking Employment"
  );

  const interviewing = alumni.filter(
    (person) => person.status === "Interviewing"
  );

  const employed = alumni.filter((person) => person.status === "Employed");

  const needsFollowUp = alumni.filter(
    (person) => person.status === "Needs Follow-Up"
  );

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Alumni Outreach</h1>
          <p className="page-subtitle">
            Track alumni career support, employment status, follow-ups, and job
            search progress.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>{alumni.length}</h2>
          <p>Total Alumni</p>
        </div>

        <div className="stat-card">
          <h2>{seekingEmployment.length}</h2>
          <p>Seeking Employment</p>
        </div>

        <div className="stat-card">
          <h2>{interviewing.length}</h2>
          <p>Interviewing</p>
        </div>

        <div className="stat-card">
          <h2>{employed.length}</h2>
          <p>Employed</p>
        </div>
      </div>

      <div className="hero-card">
        <div>
          <p className="eyebrow">Alumni Support</p>
          <h2>Keep career support organized after graduation.</h2>
          <p>
            Use this page to track who needs help, who is interviewing, who is
            employed, and who needs follow-up from the career team.
          </p>
        </div>
      </div>

      <div className="info-card">
        <h2>Add Alumni Record</h2>

        <form className="job-form" onSubmit={addAlumni}>
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
          />

          <select name="track" value={form.track} onChange={handleChange}>
            <option>Software Development</option>
            <option>Cybersecurity</option>
            <option>Data Analytics</option>
          </select>

          <select name="status" value={form.status} onChange={handleChange}>
            <option>Seeking Employment</option>
            <option>Interviewing</option>
            <option>Employed</option>
            <option>Needs Follow-Up</option>
          </select>

          <textarea
            name="notes"
            placeholder="Notes, follow-up reminders, job search updates..."
            value={form.notes}
            onChange={handleChange}
          />

          <button type="submit">Add Alumni</button>
        </form>
      </div>

      <div className="info-card">
        <h2>Follow-Up Needed ({needsFollowUp.length})</h2>

        {needsFollowUp.length === 0 ? (
          <p>No alumni currently marked as needing follow-up.</p>
        ) : (
          <div className="job-grid">
            {needsFollowUp.map((person) => (
              <div className="job-card" key={person.id}>
                <h3>{person.name}</h3>
                <p className="company">{person.email}</p>
                <p>{person.phone || "No phone listed"}</p>

                <div className="tag-row">
                  <span>{person.track}</span>
                  <span>{person.status}</span>
                </div>

                <p>{person.notes}</p>

                <button
                  className="delete-btn"
                  onClick={() => deleteAlumni(person.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="job-grid">
        {alumni.map((person) => (
          <div className="job-card" key={person.id}>
            <h3>{person.name}</h3>
            <p className="company">{person.email}</p>
            <p>{person.phone || "No phone listed"}</p>

            <div className="tag-row">
              <span>{person.track}</span>
              <span>{person.status}</span>
            </div>

            <p>{person.notes || "No notes added yet."}</p>

            <button className="delete-btn" onClick={() => deleteAlumni(person.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}