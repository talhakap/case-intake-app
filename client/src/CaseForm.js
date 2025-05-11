import { useState } from "react";
import { Link } from "react-router-dom";

function CaseForm({ user, onLogout }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    caseType: "Complaint",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("Submitting...");

    try {
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("caseType", formData.caseType);
      form.append("description", formData.description);
      if (file) form.append("file", file);

      const response = await fetch("http://localhost:5268/api/case", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(`Submitted! Reference #: ${data.reference}`);
        setFormData({ fullName: "", email: "", caseType: "Complaint", description: "" });
        setFile(null);
      } else {
        setResponseMessage("Submission failed.");
      }
    } catch (err) {
      setResponseMessage("Server error.");
    }
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Welcome, {user.username} ({user.role})</h2>
        <button onClick={onLogout}>Logout</button>
      </div>

      <h3>Submit a Case</h3>
      <form onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <select name="caseType" value={formData.caseType} onChange={handleChange}>
          <option value="Complaint">Complaint</option>
          <option value="Request">Request</option>
          <option value="Inquiry">Inquiry</option>
        </select>
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <label>Attach File:</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Submit</button>
      </form>
      <p className="response">{responseMessage}</p>

      {user.role === "admin" && (
        <Link to="/cases">
          <button style={{ marginTop: "1rem" }}>View Submitted Cases</button>
        </Link>
      )}
    </div>
  );
}

export default CaseForm;
