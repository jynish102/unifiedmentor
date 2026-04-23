import { useEffect, useState } from "react";
import API from "../../utils/api";

export default function OwnerMaintenance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMaintenance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/maintenance/property/:propertyId", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  //  update status
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/maintenance/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // refresh
      fetchMaintenance();
    } catch (err) {
      console.error(err);
      alert("Failed to update");
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
                    {item.property?.title}
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

              {/* STATUS + ACTION */}
              <div className="flex items-center justify-between mt-4">
                {/* STATUS */}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    item.status === "pending"
                      ? "bg-gray-200"
                      : item.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.status}
                </span>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(item._id, "in-progress")}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Start
                  </button>

                  <button
                    onClick={() => updateStatus(item._id, "completed")}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
