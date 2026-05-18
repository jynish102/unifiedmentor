import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import toast from "react-hot-toast";

export default function AddAmenity() {
  const navigate = useNavigate();
  const { id, propertyId } = useParams();
  const [timeError, setTimeError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "N/A",
    price: "",
    capacity: "1",
    location: "",
    operatingHours: {
      start: "",
      end: "",
      closesNextDay: false,
    },
    status: "operational",
    priority: "medium",
    upcomingMaintenanceDate: "",
  });

  //name validation
  const validateName = (name) => {
    return /^[A-Za-z\s]{2,}$/.test(name);
  };

  const nameIsValid = validateName(formData.name);

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchAmenity = async () => {
        const res = await API.get(`/amenity/${id}`);
        const data = res.data.data;

        // console.log("API DATA:", data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          capacity: data.capacity || "1",
          location: data.location || "",
          operatingHours: {
            start: data.operatingHours?.start?.slice(0, 5) || "",
            end: data.operatingHours?.end?.slice(0, 5) || "",
            closesNextDay: data.operatingHours?.closesNextDay || false,
          },

          status: data.status || "operational",
          priority: data.priority || "medium",
          upcomingMaintenanceDate: data.upcomingMaintenanceDate || "",
        });

        setExistingImages(data.images || []);
        console.log(existingImages);
      };

      fetchAmenity();
    }
  }, [id]);

  // useEffect(() => {
  //   return () => {
  //     images.forEach((file) => URL.revokeObjectURL(file.preview));
  //   };
  // }, [images]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      [
        "price",
        "deposit",
        "bedrooms",
        "bathrooms",
        "area",
        "floor",
        "totalFloors",
        "units",
        "occupied",
        "capacity",
      ].includes(name)
    ) {
      if (value < 0) return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //Operating Hours
  const validateOperatingHours = (start, end, closesNextDay) => {
    if (!start || !end) {
      setTimeError("");
      return;
    }

    // Same time not allowed
    if (start === end) {
      setTimeError("Start time and end time cannot be same");
      return;
    }

    // Same-day validation
    if (!closesNextDay && start > end) {
      setTimeError("End time must be after start time");
      return;
    }

    // Valid
    setTimeError("");
  };

  //timeChange Function
  const handleTimeChange = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [field]: value,
        },
      };

      validateOperatingHours(
        updated.operatingHours.start,
        updated.operatingHours.end,
        updated.operatingHours.closesNextDay,
      );

      return updated;
    });
  };

  //close next Day Function
  const handleNextDayChange = (e) => {
    const checked = e.target.checked;

    setFormData((prev) => {
      const updated = {
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          closesNextDay: checked,
        },
      };

      validateOperatingHours(
        updated.operatingHours.start,
        updated.operatingHours.end,
        checked,
      );

      return updated;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length !== files.length) {
      toast.error("Only image files allowed!");
      e.target.value = ""; // reset input
      return;
    }

    const totalImages =
      existingImages.length + images.length + validImages.length;
    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed!");
      e.target.value = "";
      return;
    }

    const filesWithPreview = validImages.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...filesWithPreview]);
    e.target.value = ""; // reset input
  };
  // Remove new selected image
  const handleRemoveNewImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  // Remove existing image (edit mode)
  const handleRemoveExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameIsValid) {
      toast.error("Please enter valid amenity name");
      return;
    }

    if (formData.price < 0) {
      toast.error("Price cannot be negative");
      return;
    }

    if (formData.capacity < 1) {
      toast.error("Capacity must be at least 1");
      return;
    }
    
    if (existingImages.length + images.length > 5) {
      toast.error("Max 5 images allowed");
      return;
    }
    if (timeError) {
      toast.error("Please fix operating hours");
      return;
    }

    try {
      const data = new FormData();
      const token = localStorage.getItem("token");

      // append text fields
      Object.keys(formData).forEach((key) => {
        if (key === "operatingHours") {
          data.append(
            "operatingHours",
            JSON.stringify(formData.operatingHours),
          );
        } else {
          data.append(key, formData[key]);
        }
      });
      // old images (only for edit)
      if (id) {
        data.append("existingImages", JSON.stringify(existingImages));
      }

      // append images
      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i].file);
      }

      if (id) {
        // UPDATE
        await API.put(`/amenity/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Amenity Updated ");
      } else {
        // ADD
        await API.post(`/amenity/${propertyId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Amenity Added ");
      }

      navigate("/owner/amenities");
    } catch (err) {
      console.log(err.res?.data?.message || "Error");
      const message =
        err.response?.data?.message || // backend message
        err.message || // axios error
        "Something went wrong ";

      toast.error(message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-t-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              {id ? "Update Amenity" : "Add New Amenity"}
            </h2>

            <p className="text-sm text-white/80 mt-1">
              Fill all details about the amenity
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white shadow-2xl rounded-b-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ================= BASIC INFO ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenity Name*
                </label>

                <Input
                autoFocus
                  name="name"
                  type="text"
                  placeholder="Swimming Pool"
                  value={formData.name}
                  onChange={handleChange}
                  className={`h-11 border ${
                    formData.name
                      ? nameIsValid
                        ? "border-green-400"
                        : "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {formData.name && (
                  <p
                    className={`text-sm mt-2 ${
                      nameIsValid ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {nameIsValid
                      ? "✓ Valid name"
                      : "✗ Only letters and spaces allowed"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>

                <Input
                  name="location"
                  type="text"
                  placeholder="Tower A - Ground Floor"
                  value={formData.location}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe this amenity..."
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* ================= DETAILS ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Amenity Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price*
                </label>

                <Input
                  name="price"
                  type="number"
                  min="0"
                  placeholder="100"
                  value={formData.price}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity
                </label>

                <Input
                  name="capacity"
                  type="number"
                  min="1"
                  placeholder="50"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="operational">Operational</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          {/* ================= OPERATING HOURS ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Operating Hours
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closes Next Day
                </label>

                <input
                  type="checkbox"
                  name="closesNextDay"
                  checked={formData.operatingHours.closesNextDay}
                  onChange={handleNextDayChange}
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>

                <Input
                  name="start"
                  type="time"
                  value={formData.operatingHours?.start}
                  onChange={(e) => handleTimeChange("start", e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>

                <Input
                  name="end"
                  type="time"
                  value={formData.operatingHours?.end}
                  onChange={(e) => handleTimeChange("end", e.target.value)}
                  className="h-11"
                  required
                />
                {timeError && (
                  <p className="text-red-500 text-sm mt-2">{timeError}</p>
                )}
              </div>
            </div>
          </div>

          {/* ================= MAINTENANCE ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Maintenance Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {formData.status === "maintenance" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upcoming Maintenance Date
                </label>

                <Input
                  name="upcomingMaintenanceDate"
                  type="date"
                  value={formData.upcomingMaintenanceDate}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* ================= IMAGE UPLOAD ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Amenity Images
            </h3>

            {/* Upload Box */}
            <label className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
              <p className="font-semibold text-gray-700">
                Click to Upload Images
              </p>

              <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Images */}
            <div className="flex flex-wrap gap-4 mt-6">
              {/* Existing Images */}
              {existingImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={`http://localhost:5000/${img}`}
                    alt="amenity"
                    className="w-28 h-28 rounded-xl object-cover shadow-md"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="cursor-pointer absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* New Images */}
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={file.preview}
                    alt="preview"
                    className="w-28 h-28 rounded-xl object-cover shadow-md"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="cursor-pointer absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ================= BUTTONS ================= */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              onClick={() => navigate("/owner/amenities")}
              variant="outline"
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-8"
             
            >
              {id ? "Update Amenity" : "Add Amenity"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
