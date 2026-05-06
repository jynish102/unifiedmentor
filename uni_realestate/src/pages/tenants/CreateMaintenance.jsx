import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";

export default function CreateMaintenance() {
  const { type, id } = useParams();
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

  // validation function
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (formData.title.length < 5) {
      toast.error("Title must be at least 5 characters");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (!type || !id) {
      toast.error("Invalid request");
      return false;
    }

    return true;
  };

  // submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        ...(type === "property" && { property: id }),
        ...(type === "amenity" && { amenity: id }),
      };

      await API.post("/maintenance", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Maintenance request created successfully");

      setTimeout(() => {
        navigate("/tenant/maintenance");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create request");
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
          placeholder="Issue Title"
          className="w-full border px-3 py-2 rounded focus:outline-blue-500"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue..."
          className="w-full border px-3 py-2 rounded focus:outline-blue-500"
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
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </div>
  );
}
