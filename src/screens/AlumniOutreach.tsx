import { useEffect, useState } from "react";

type Alumni = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  employer: string;
  needsSupport: string;
  dateContacted: string;
  notes: string;
};

export default function AlumniOutreach() {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const [newAlumni, setNewAlumni] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Employed",
    employer: "",
    needsSupport: "No",
    dateContacted: "",
    notes: "",
  });

  useEffect(() => {
    const savedAlumni = localStorage.getItem("pivotAlumni");

    if (savedAlumni) {
      setAlumniList(JSON.parse(savedAlumni));
    }
  }, []);

  function saveAlumni(updatedAlumni: Alumni[]) {
    setAlumniList(updatedAlumni);
    localStorage.setItem("pivotAlumni", JSON.stringify(updatedAlumni));
  }

  function addAlumni(e: React.FormEvent) {
    e.preventDefault();

    if (!newAlumni.name || !newAlumni.email) {
      alert("Please add alumni name and email.");
      return;
    }

    saveAlumni([
      {
        id: Date.now(),
        ...newAlumni,
      },
      ...alumniList,
    ]);

    setNewAlumni({
      name: "",
      email: "",
      phone: "",
      status: "Employed",
      employer: "",
      needsSupport: "No",
      dateContacted: "",
      notes: "",
    });

    setShowForm(false);
  }

  function deleteAlumni(alumniId: number) {
    const updatedAlumni = alumniList.filter((alumni) => alumni.id !== alumniId);
    saveAlumni(updatedAlumni);
  }

  const filteredAlumni =
    statusFilter === "All"
      ? alumniList
      : alumniList.filter((alumni) => alumni.status === statusFilter);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Alumni Outreach</h1>
          <p>Track alumni check-ins, employment status, and support needs.</p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Add Alumni"}
        </button>
      </div>

      {showForm && (
        <form className="form-grid" onSubmit={addAlumni}>
          <input
            type="text"
            placeholder="Full Name"
            value={newAlumni.name}
            onChange={(e) =>
              setNewAlumni({ ...newAlumni, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={newAlumni.email}
            onChange={(e) =>
              setNewAlumni({ ...newAlumni, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone"
            value={newAlumni.phone}
            onChange={(e) =>
              setNewAlumni({ ...newAlumni, phone: e.target.value })
            }
          />

          <select
            value={newAlumni.status}
            onChange={(e) =>
              setNewAlumni({ ...newAlumni, status: e.target.value })
            }
          >
            <option>Employed</option>
            <option>Seeking Employment</option>
            <option>In Training</option>
            <option>Unknown</option>
          </select>

          <input
            type="text"
            placeholder="Current Employer"
            value={newAlumni.employer}
            onChange={(e) =>
              setNewAlumni({ ...newAlumni, employer: e.target.value })
            }
          />

          <select
            value={newAlumni.needsSupport}
            onChange={(e) =>
              setNewAlumni({ ...newAlumni, needsSupport: e.target.value })
            }
          >
            <option>No</option>
            <option>Yes</option>
          </select>

          <input
            type="date"
            value={newAlumni.dateContacted}
            onChange={(e) =>
              setNewAlumni({ ...newAlumni, dateContacted: e.target.value })
            }
          />

          <textarea
            placeholder="Notes"
            value={newAlumni.notes}
            onChange={(e) =>
              setNewAlumni({ ...newAlumni, notes: e.target.value })
            }
          />

          <button type="submit">Save Alumni</button>
        </form>
      )}

      <div className="toolbar">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Employed</option>
          <option>Seeking Employment</option>
          <option>In Training</option>
          <option>Unknown</option>
        </select>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Employer</th>
              <th>Needs Support</th>
              <th>Date Contacted</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredAlumni.map((alumni) => (
              <tr key={alumni.id}>
                <td>{alumni.name}</td>
                <td>{alumni.email}</td>
                <td>{alumni.phone}</td>
                <td>{alumni.status}</td>
                <td>{alumni.employer}</td>
                <td>{alumni.needsSupport}</td>
                <td>{alumni.dateContacted}</td>
                <td>{alumni.notes}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteAlumni(alumni.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredAlumni.length === 0 && (
              <tr>
                <td colSpan={9}>No alumni records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}