import { useEffect, useState } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";

export default function StaffMaintenance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const steps = ["pending", "assigned", "in-progress", "completed"];
  const [files, setFiles] = useState({});
  const [previewImg, setPreviewImg] = useState(null);
  const [completeModal, setCompleteModal] = useState({
    open: false,
    id: null,
  });

  //  Fetch ONLY assigned maintenance
  const fetchMaintenance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/maintenance/my-assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("FRONTEND DATA:", res.data.data);

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

  //  Update status (staff actions)
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

  const uploadProof = async (id) => {
    try {
      const selectedFiles = files[id];

      if (!selectedFiles || selectedFiles.length === 0) {
        return toast.error("Select images first");
      }

      const token = localStorage.getItem("token");

      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await API.put(`/maintenance/${id}/upload-proof`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Images uploaded");
      fetchMaintenance();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  const handleComplete = async (id) => {
    try {
      const selectedFiles = files[id];

      if (!selectedFiles || selectedFiles.length === 0) {
        return toast.error("At least 1 image required");
      }

      const token = localStorage.getItem("token");

      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("status", "completed");

      //Upload proof images first
      await API.put(
        `/maintenance/${id}/upload-proof?status=completed`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 2 Update status
      await API.put(
        `/maintenance/${id}/status`,
        { status: "completed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Maintenance completed");

      // reset
      setCompleteModal({ open: false, id: null });
      setFiles({});

      fetchMaintenance();
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete");
    }
  };

  const deleteImage = async (id, image) => {
    try {
      const token = localStorage.getItem("token");
      // console.log("Deleting image:", image, "from maintenance ID:", id);
      // console.log("Token:", token);

      await API.delete(
        `/maintenance/${id}/delete-proof`,

        {
          data: { image }, // Pass the image URL in the request body
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Image removed");
      fetchMaintenance();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
        
          "You cannot delete images after completion",
      );
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

                {/*  ACTION BUTTONS (STAFF ONLY) */}
                <div className="flex gap-2 mt-4">
                  {item.status === "assigned" && (
                    <Button
                      onClick={() => updateStatus(item._id, "in-progress")}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Start Work
                    </Button>
                  )}

                  {item.status === "in-progress" && (
                    <Button
                      onClick={() =>
                        setCompleteModal({ open: true, id: item._id })
                      }
                      disabled={
                        !item.proofImages || item.proofImages.length === 0
                      }
                      className={`px-3 py-1 text-white rounded ${
                        !item.proofImages || item.proofImages.length === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600"
                      }`}
                    >
                      Complete
                    </Button>
                  )}
                </div>

                {/* IMAGE UPLOAD (ONLY DURING IN-PROGRESS) */}
                {item.status === "in-progress" && (
                  <div className="mt-4 space-y-2">
                    <p className="text-lg text-gray-500">
                      You can upload maximum 5 images
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => {
                        const selected = Array.from(e.target.files);

                        const allowedTypes = [
                          "image/jpeg",
                          "image/png",
                          "image/webp",
                          "image/jpg",
                        ];

                        const invalidFiles = selected.filter(
                          (file) => !allowedTypes.includes(file.type),
                        );

                        if (invalidFiles.length > 0) {
                          toast.error("Only JPG, PNG, WEBP images allowed");
                          return;
                        }

                        if (selected.length > 5) {
                          toast.error("Maximum 5 images allowed");
                          return;
                        }

                        setFiles({
                          ...files,
                          [item._id]: Array.from(e.target.files),
                        });
                      }}
                      className="border p-2 rounded w-full"
                    />

                    <Button
                      onClick={() => uploadProof(item._id)}
                      className="px-3 py-1 bg-purple-600 text-white rounded"
                    >
                      Upload Proof
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

                            {/* DELETE BUTTON */}
                            {item.status === "in-progress" && (
                              <Button
                                onClick={() => deleteImage(item._id, img.url)}
                                className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                              >
                                ✕
                              </Button>
                            )}
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

                {/* for complete button modal*/}
                {completeModal.open && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[400px] space-y-4 relative">
                      {/* CLOSE */}
                      <Button
                        onClick={() =>
                          setCompleteModal({ open: false, id: null })
                        }
                        className="absolute top-2 right-3 text-xl text-gray-600"
                      >
                        ✕
                      </Button>

                      <h2 className="text-lg font-semibold">
                        Complete Maintenance
                      </h2>

                      <p className="text-sm text-gray-500">
                        Upload at least 1 image (max 5)
                      </p>

                      {/* FILE INPUT */}
                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => {
                          const selected = Array.from(e.target.files);

                          const allowedTypes = [
                            "image/jpeg",
                            "image/png",
                            "image/webp",
                          ];

                          const invalidFiles = selected.filter(
                            (file) => !allowedTypes.includes(file.type),
                          );

                          if (invalidFiles.length > 0) {
                            toast.error("Only JPG, PNG, WEBP images allowed");
                            return;
                          }

                          if (selected.length > 5) {
                            toast.error("Max 5 images allowed");
                            return;
                          }

                          setFiles({
                            ...files,
                            [completeModal.id]: selected,
                          });
                        }}
                        className="border p-2 rounded w-full"
                      />

                      {/* PREVIEW */}
                      <div className="flex gap-2 flex-wrap">
                        {(files[completeModal.id] || []).map((file, i) => (
                          <img
                            key={i}
                            src={URL.createObjectURL(file)}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                      </div>

                      {/* CONFIRM BUTTON */}
                      <Button
                        onClick={() => handleComplete(completeModal.id)}
                        className="w-full bg-green-600 text-white py-2 rounded"
                      >
                        Confirm Complete
                      </Button>
                    </div>
                  </div>
                )}

                {/* TRACKER */}
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
                                ></div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Labels */}
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                          {steps.map((step) => (
                            <span key={step} className="capitalize flex-1 text">
                              {step}
                            </span>
                          ))}
                        </div>
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
