import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SubmittedCases() {
  const [cases, setCases] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  const fetchCases = async () => {
    try {
      const response = await fetch("http://localhost:5268/api/case");
      const data = await response.json();
      setCases(data);
    } catch (err) {
      console.error("Failed to fetch cases");
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const startEditing = (c) => {
    setEditingId(c.id);
    setEditForm({ ...c }); // clone the case data
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateCase = async () => {
    try {
      const response = await fetch(`http://localhost:5268/api/case/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        await fetchCases();
        cancelEditing();
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      alert("Server error during update.");
    }
  };

  const deleteCase = async (id) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;

    try {
      const response = await fetch(`http://localhost:5268/api/case/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCases(cases.filter(c => c.id !== id));
      } else {
        alert("Delete failed.");
      }
    } catch (err) {
      alert("Server error during delete.");
    }
  };

  const downloadCSV = () => {
    if (cases.length === 0) return;

    const headers = ["ID", "Full Name", "Email", "Case Type", "Description", "Submitted At"];
    const rows = cases.map(c =>
      [c.id, c.fullName, c.email, c.caseType, c.description, new Date(c.submittedAt).toLocaleString()]
    );

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "submitted_cases.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadDynamicsJson = () => {
  if (cases.length === 0) return;

  const dynamicsPayload = cases.map(c => ({
    title: `${c.caseType}: ${c.description}`,
    "customerid_contact@odata.bind": `/contacts(${c.id.toString().padStart(8, '0')}0000-0000-0000-000000000000)`, // placeholder contact GUID
    description: c.description,
    caseorigincode: 2,  // Let's assume 2 = Email for this example
    prioritycode: 2,    // Default Normal
    "subjectid@odata.bind": `/subjects(${c.id.toString().padStart(8, '0')}0000-0000-0000-000000000000)` // placeholder subject GUID
  }));

  const blob = new Blob([JSON.stringify(dynamicsPayload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "dynamics_payload.json");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Submitted Cases</h2>
        <button onClick={() => navigate("/")}>← Back</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Case Type</th>
            <th>Description</th>
            <th>File</th>
            <th>Submitted At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>
                {editingId === c.id ? (
                  <input name="fullName" value={editForm.fullName} onChange={handleEditChange} />
                ) : (
                  c.fullName
                )}
              </td>
              <td>
                {editingId === c.id ? (
                  <input name="email" value={editForm.email} onChange={handleEditChange} />
                ) : (
                  c.email
                )}
              </td>
              <td>
                {editingId === c.id ? (
                  <select name="caseType" value={editForm.caseType} onChange={handleEditChange}>
                    <option value="Complaint">Complaint</option>
                    <option value="Request">Request</option>
                    <option value="Inquiry">Inquiry</option>
                  </select>
                ) : (
                  c.caseType
                )}
              </td>
              <td>
                {editingId === c.id ? (
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} />
                ) : (
                  c.description
                )}
              </td>
              <td>
                {c.filePath ? (
                  <a href={`http://localhost:5268/files/${c.filePath}`} target="_blank" rel="noreferrer">Download</a>
                ) : "N/A"}
              </td>
              <td>{new Date(c.submittedAt).toLocaleString()}</td>
              <td>
                {editingId === c.id ? (
                  <>
                    <button onClick={updateCase}>💾 Save</button>
                    <button onClick={cancelEditing}>✖ Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(c)}>✏️ Edit</button>
                    <button onClick={() => deleteCase(c.id)} style={{ marginLeft: "10px" }}>🗑️ Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={downloadCSV} style={{ marginRight: "10px" }}>Download as CSV</button>
      <button onClick={downloadDynamicsJson}>Download for Dynamics</button>

      <button
        onClick={async () => {
            if (window.confirm("Are you sure you want to delete ALL cases and reset IDs?")) {
            const res = await fetch("http://localhost:5268/api/case/reset", {
                method: "POST"
            });

            if (res.ok) {
                await fetchCases();
                alert("All cases have been reset.");
            } else {
                alert("Failed to reset.");
            }
            }
        }}
        style={{ backgroundColor: "#a30000", color: "white", marginLeft: "10px" }}
        >
        Reset All Cases
      </button>


    </div>
  );
}

export default SubmittedCases;
