import { useEffect, useState } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast";

export default function StaffMaintenance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const steps = ["pending", "assigned", "in-progress", "completed"];

  //  Fetch ONLY assigned maintenance
  const fetchMaintenance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/maintenance/my-assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch maintenance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  // 🔥 Update status (staff actions)
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/maintenance/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Status updated");
      fetchMaintenance();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Assigned Work</h1>

      {data.length === 0 ? (
        <p>No assigned maintenance</p>
      ) : (
        <div className="grid gap-4">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              {/* TOP */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-500">
                    {item.property?.title || item.amenity?.name}
                  </p>
                </div>

                {/* PRIORITY */}
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    item.priority === "emergency"
                      ? "bg-red-100 text-red-700"
                      : item.priority === "high"
                        ? "bg-orange-100 text-orange-700"
                        : item.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.priority}
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="mt-2 text-gray-700">
                {item.description || "No description"}
              </p>

              {/* STATUS */}
              <div className="mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    item.status === "pending"
                      ? "bg-gray-200"
                      : item.status === "assigned"
                        ? "bg-purple-100 text-purple-700"
                        : item.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* 🔥 ACTION BUTTONS (STAFF ONLY) */}
              <div className="flex gap-2 mt-4">
                {item.status === "assigned" && (
                  <button
                    onClick={() => updateStatus(item._id, "in-progress")}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Start Work
                  </button>
                )}

                {item.status === "in-progress" && (
                  <button
                    onClick={() => updateStatus(item._id, "completed")}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Complete
                  </button>
                )}
              </div>

              {/* 🔥 TRACKER */}
              <div className="mt-4">
                {(() => {
                  const statusMap = {
                    pending: "pending",
                    assigned: "assigned",
                    "in-progress": "in-progress",
                    inprogress: "in-progress",
                    completed: "completed",
                  };

                  const normalizedStatus =
                    statusMap[item.status?.toLowerCase().trim()] || "pending";

                  const currentIndex = steps.indexOf(normalizedStatus);

                  return (
                    <>
                      <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                          <div key={step} className="flex-1 flex items-center">
                            {/* Circle */}
                            <div
                              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold
                              ${
                                index < currentIndex
                                  ? "bg-green-500 text-white"
                                  : index === currentIndex
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {index + 1}
                            </div>

                            {/* Line */}
                            {index !== steps.length - 1 && (
                              <div
                                className={`flex-1 h-1 mx-2 ${
                                  index < currentIndex
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Labels */}
                      <div className="flex justify-between mt-2 text-xs text-gray-600">
                        {steps.map((step) => (
                          <span
                            key={step}
                            className="capitalize flex-1 text"
                          >
                            {step}
                          </span>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
