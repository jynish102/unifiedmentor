import { useEffect, useState } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";

export default function OwnerMaintenance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignInputs, setAssignInputs] = useState({});
  const [staffList, setStaffList] = useState([]);
  const steps = ["pending", "assigned", "in-progress", "completed"];
  const [previewImg, setPreviewImg] = useState(null);

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

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/staff/my-staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStaffList(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch staff");
    }
  };

  useEffect(() => {
    fetchMaintenance();
    fetchStaff();
  }, []);

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
      toast.error("Error fetching maintenance:", err);
    }
  };

  // Assign maintenance
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
          {data.map((item) => {
             const inProgressImages = item.proofImages?.filter(
              (img) => img.status === "in-progress",
            );

            const completedImages = item.proofImages?.filter(
              (img) => img.status === "completed",
            );

            const formatDate = (date) => {
              return new Date(date).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              });
            };

            return (
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
                        : item.status === "assigned"
                          ? "bg-purple-100 text-purple-700"
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

                {/*  ASSIGN INPUT */}
                {!item.assignedTo && item.status !== "rejected" && (
                  <div className="mt-3 flex gap-2">
                    <select
                      className="border px-2 py-1 rounded w-full"
                      value={assignInputs[item._id] || ""}
                      onChange={(e) =>
                        setAssignInputs({
                          ...assignInputs,
                          [item._id]: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Staff</option>

                      {staffList.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.fullname} ({s.specialization})
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={() => assignMaintenance(item._id)}
                      className="px-3 py-1 bg-purple-600 text-white rounded"
                    >
                      Assign
                    </Button>
                  </div>
                )}

                {previewImg && (
                  <div
                    className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setPreviewImg(null)}
                  >
                    <img
                      src={previewImg}
                      onClick={(e) => e.stopPropagation()}
                      className="max-w-[90%] max-h-[90%] rounded shadow-lg"
                    />
                    <Button
                      className="absolute top-5 right-5 text-red-500 text-3xl"
                      onClick={() => setPreviewImg(null)}
                    >
                      ✕
                    </Button>
                  </div>
                )}

                {/* Uploaded Images - STAFF VIEW */}
                {inProgressImages?.length > 0 && (
                  <div className="mt-3">
                    {/* Section Title */}
                    <p className="text-sm font-semibold text-blue-600 mb-2">
                      Work Progress Images
                    </p>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      {inProgressImages.map((img, i) => (
                        <div key={i} className="w-20">
                          <div className="relative">
                            <img
                              src={`http://localhost:5000/${img.url}`}
                              onClick={() =>
                                setPreviewImg(
                                  `http://localhost:5000/${img.url}`,
                                )
                              }
                              className="w-20 h-20 rounded object-cover cursor-pointer"
                            />

                            {/* STATUS BADGE */}
                            <span className="absolute bottom-0 left-0 bg-blue-600 text-white text-[10px] px-1 rounded">
                              In Progress
                            </span>
                          </div>

                          {/* DATE */}
                          <p className="text-[10px] text-gray-500 mt-1 text-center">
                            {formatDate(img.uploadedAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {completedImages?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-green-600 mb-2">
                      Completed Work Images
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      {completedImages.map((img, i) => (
                        <div className="w-20" key={i}>
                          <div className="relative">
                            <img
                              src={`http://localhost:5000/${img.url}`}
                              onClick={() =>
                                setPreviewImg(
                                  `http://localhost:5000/${img.url}`,
                                )
                              }
                              className="w-20 h-20 rounded object-cover cursor-pointer"
                            />

                            <span className="absolute bottom-0 left-0 bg-green-600 text-white text-[10px] px-1 rounded">
                              Completed
                            </span>
                          </div>
                          {/* DATE */}
                          <p className="text-[10px] text-gray-500 mt-1 text-center">
                            {formatDate(img.uploadedAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/*  ACTION BUTTONS */}
                {item.status !== "rejected" && (
                  <div className="flex gap-2 mt-4">
                    {item.status !== "completed" && (
                      <button
                        onClick={() => updateStatus(item._id, "rejected")}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                )}

                {/*  UPDATES TIMELINE */}
                <div className="mt-4">
                  {(() => {
                    const statusMap = {
                      pending: "pending",
                      assigned: "assigned",
                      "in-progress": "in-progress",
                      inprogress: "in-progress",
                      completed: "completed",
                      rejected: "rejected",
                    };

                    const normalizedStatus =
                      statusMap[item.status?.toLowerCase().trim()] || "pending";

                    const isRejected = normalizedStatus === "rejected";

                    const currentIndex = isRejected
                      ? 0 // force no active step
                      : steps.indexOf(normalizedStatus);

                    console.log("STATUS:", item.status, "INDEX:", currentIndex);

                    return (
                      <>
                        {isRejected ? (
                          <p className="text-center text-red-600 font-semibold bg-red-50 py-2 rounded">
                            Request Rejected
                          </p>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              {steps.map((step, index) => (
                                <div
                                  key={step}
                                  className="flex-1 flex items-center"
                                >
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
                                    />
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Labels */}
                            <div className="flex justify-between mt-2 text-xs text-gray-600">
                              {steps.map((step) => (
                                <span
                                  key={step}
                                  className="flex-1 text text-xs text-gray-600"
                                >
                                  {step.replace("-", " ")}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
