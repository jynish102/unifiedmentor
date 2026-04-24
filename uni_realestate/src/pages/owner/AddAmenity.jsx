import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function AddAmenity() {
  const navigate = useNavigate();
  const { id, propertyId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "1",
    location: "",
    operatingHours: {
      start: "",
      end: "",
    },
    status: "operational",
    priority: "medium",
    upcomingMaintenanceDate: "",
  });

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [field]: value,
        },
      };

      if (
        updated.operatingHours.start &&
        updated.operatingHours.end &&
        updated.operatingHours.start > updated.operatingHours.end
      ) {
        alert("Start time must be before end time");
      }

      return updated;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length !== files.length) {
      alert("Only image files allowed!");
      e.target.value = ""; // reset input
      return;
    }

    const totalImages =
      existingImages.length + images.length + validImages.length;
    if (totalImages > 5) {
      alert("Maximum 5 images allowed!");
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
    if (existingImages.length + images.length > 5) {
      alert("Max 5 images allowed");
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
        alert("Amenity Updated ");
      } else {
        // ADD
        await API.post(`/amenity/${propertyId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Amenity Added ");
      }

      navigate("/owner/amenities");
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || // backend message
        err.message || // axios error
        "Something went wrong ";

      alert(message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Amenity</h2>
      <button
        onClick={() => navigate("/owner/amenities")}
        className="bg-gray-500 text-white px-3 py-1 rounded"
      >
        Cancel
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          name="description"
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <Input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />

        <Input
          name="capacity"
          type="number"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
        />

        <Input
          name="location"
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <Input
          className="flex items-center gap-2"
          name="start"
          placeholder="Start Time"
          type="time"
          value={formData.operatingHours?.start}
          onChange={(e) => handleTimeChange("start", e.target.value)}
        />

        <Input
          className="flex items-center gap-2"
          name="end"
          placeholder="End Time"
          type="time"
          value={formData.operatingHours?.end}
          onChange={(e) => handleTimeChange("end", e.target.value)}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="operational">Operational</option>
          <option value="maintenance">Maintenance</option>
        </select>
      
        {formData.status === "maintenance" && (
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        )}

        <Input
          className="flex items-center gap-2"
          name="upcomingMaintenanceDate"
          type="date"
          placeholder="Maintenance Date"
          value={formData.upcomingMaintenanceDate}
          onChange={handleChange}
        />

        <div className="flex gap-3 flex-wrap mt-2">
          {/* Existing Images (Edit Mode) */}
          {existingImages.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={`http://localhost:5000/${img}`}
                alt="amenity"
                className="w-24 h-24 object-cover rounded"
              />

              <button
                type="button"
                onClick={() => handleRemoveExistingImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
              >
                ❌
              </button>
            </div>
          ))}

          {/* New Images */}
          {images.map((file, index) => (
            <div key={index} className="relative">
              <button
                type="button"
                onClick={() => handleRemoveNewImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
              >
                ❌
              </button>
              <img
                src={file.preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded"
              />
            </div>
          ))}
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <Button type="submit" className="w-full">
          {id ? "Update Amenity" : "Add Amenity"}
        </Button>
      </form>
    </div>
  );
}
