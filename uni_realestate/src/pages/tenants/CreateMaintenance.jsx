import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import toast from "react-hot-toast";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function CreateMaintenance() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  // Handle Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validation
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

    return true;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

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

      toast.success("Maintenance request created");

      navigate("/tenant/maintenance");
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-t-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold">Report Maintenance Issue</h2>

        <p className="text-sm text-white/80 mt-1">
          Submit your maintenance request details
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white shadow-2xl rounded-b-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BASIC INFO */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Issue Information
            </h3>

            <div className="space-y-5">
              {/* TITLE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title*
                </label>

                <Input
                  name="title"
                  placeholder="Water leakage in bathroom"
                  value={formData.title}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description*
                </label>

                <textarea
                  name="description"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* PRIORITY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
