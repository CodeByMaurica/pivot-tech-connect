import { useEffect, useState } from "react";

type Alumni = {
  id: number;
  name: string;
  email: string;
  status: string;
  notes: string;
};

export default function AlumniOutreach() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
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

  function addAlumni(e: React.FormEvent) {
    e.preventDefault();

    const newAlumni: Alumni = {
      id: Date.now(),
      ...form,
    };

    setAlumni([newAlumni, ...alumni]);

    setForm({
      name: "",
      email: "",
      status: "Seeking Employment",
      notes: "",
    });
  }

  function deleteAlumni(id: number) {
    setAlumni(alumni.filter((person) => person.id !== id));
  }

  return (
    <section>
      <h1>Alumni Outreach</h1>
      <p className="page-subtitle">
        Track alumni career support, follow-ups, and employment status.
      </p>

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
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option>Seeking Employment</option>
            <option>Interviewing</option>
            <option>Employed</option>
            <option>Needs Follow-Up</option>
          </select>

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
          />

          <button type="submit">Add Alumni</button>
        </form>
      </div>

      <div className="job-grid">
        {alumni.map((person) => (
          <div className="job-card" key={person.id}>
            <h3>{person.name}</h3>
            <p>{person.email}</p>
            <p>
              <strong>Status:</strong> {person.status}
            </p>
            <p>{person.notes}</p>

            <button className="delete-btn" onClick={() => deleteAlumni(person.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}