import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";

export default function CreateMaintenance() {
  const { propertyId } = useParams(); //  from URL
  console.log(propertyId)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);

  // handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit form
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await API.post(
        "/maintenance",
        {
          ...formData,
          property: propertyId, //  auto link property
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Maintenance request created ");

      navigate("/tenant/maintenance"); // go to list page
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);;
      alert("Failed to create request ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow border p-6 space-y-4">
        <h2 className="text-xl font-semibold">Report Maintenance Issue</h2>

        {/* TITLE */}
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Issue Title (e.g., AC not working)"
          className="w-full border px-3 py-2 rounded"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue..."
          className="w-full border px-3 py-2 rounded"
        />

        {/* PRIORITY */}
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="emergency">Emergency</option>
        </select>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </div>
  );
}
