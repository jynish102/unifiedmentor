import { useEffect, useState } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast";

export default function OwnerMaintenance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignInputs, setAssignInputs] = useState({}); // store staffId per item

  // 🔥 Fetch maintenance
  const fetchMaintenance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/maintenance/owner", {
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

  // 🔥 Update status
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
      toast.error("Failed to update status");
    }
  };

  // 🔥 Assign maintenance
  const assignMaintenance = async (id) => {
    try {
      const staffId = assignInputs[id];

      if (!staffId) {
        return toast.error("Enter staff ID");
      }

      const token = localStorage.getItem("token");

      await API.put(
        `/maintenance/${id}/assign`,
        { assignedTo: staffId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Assigned successfully");
      fetchMaintenance();
    } catch (err) {
      console.error(err);
      toast.error("Assignment failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Maintenance Requests</h1>

      {data.length === 0 ? (
        <p>No requests found</p>
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

              {/* TENANT */}
              <p className="mt-2 text-sm text-gray-500">
                Tenant: {item.tenant?.fullname} ({item.tenant?.email})
              </p>

              {/* ASSIGNED */}
              <p className="mt-1 text-sm text-gray-500">
                Assigned To: {item.assignedTo?.fullname || "Not Assigned"}
              </p>

              {/* STATUS */}
              <div className="mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    item.status === "pending"
                      ? "bg-gray-200"
                      : item.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : item.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* 🔥 ASSIGN INPUT */}
              {!item.assignedTo && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Staff ID"
                    className="border px-2 py-1 rounded w-full"
                    value={assignInputs[item._id] || ""}
                    onChange={(e) =>
                      setAssignInputs({
                        ...assignInputs,
                        [item._id]: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => assignMaintenance(item._id)}
                    className="px-3 py-1 bg-purple-600 text-white rounded"
                  >
                    Assign
                  </button>
                </div>
              )}

              {/* 🔥 ACTION BUTTONS */}
              <div className="flex gap-2 mt-4">
                {item.assignedTo && item.status === "pending" && (
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

                {item.status !== "completed" && (
                  <button
                    onClick={() => updateStatus(item._id, "rejected")}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Reject
                  </button>
                )}
              </div>

              {/* 🔥 UPDATES TIMELINE */}
              <div className="mt-4 text-sm">
                <p className="font-medium">Updates:</p>
                {item.updates?.length > 0 ? (
                  item.updates.map((u, i) => <p key={i}>• {u.message}</p>)
                ) : (
                  <p>No updates yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
