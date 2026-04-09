import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function AddProperty() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    price: "",
    deposit: "",
    paymentFrequency: "monthly",
    propertyType: "Apartment",
    bedrooms: "",
    bathrooms: "",
    area: "",
    furnishing: "Semi-Furnished",
    floor: "",
    totalFloors: "",
    parking: false,
    amenities: {
      lift: false,
      gym: false,
      security: false,
      wifi: false,
    },
    units: 1,
    occupied: 0,
    status: "available",
    availableFrom: "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        const res = await API.get(`/property/${id}`);
        const data = res.data;
        // console.log("API DATA:", data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          address: data.address || "",
          city: data.city || "",
          price: data.price || "",
          deposit: data.deposit || "",
          paymentFrequency: data.paymentFrequency || "monthly",
          propertyType: data.propertyType || "Apartment",
          bedrooms: data.bedrooms || "",
          bathrooms: data.bathrooms || "",
          area: data.area || "",
          furnishing: data.furnishing || "Semi-Furnished",
          floor: data.floor || "",
          totalFloors: data.totalFloors || "",
          parking: data.parking || false,
          amenities: {
            lift: data.amenities?.lift || false,
            gym: data.amenities?.gym || false,
            security: data.amenities?.security || false,
            wifi: data.amenities?.wifi || false,
          },
          units: data.units || 1,
          occupied: data.occupied || 0,
          status: data.status || "available",
          availableFrom: data.availableFrom
            ? data.availableFrom.split("T")[0]
            : "",
        });

        setExistingImages(res.data.images || []);
      };

      fetchProperty();
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

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [name]: checked,
      },
    }));
  };

  const handleParkingChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      parking: e.target.checked, // boolean
    }));
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

    if (formData.occupied > formData.units) {
      alert("Occupied cannot exceed total units");
      return;
    }

    try {
      const data = new FormData();
      const token = localStorage.getItem("token");

      // append text fields
      Object.keys(formData).forEach((key) => {
        if (key === "amenities") {
          data.append("amenities", JSON.stringify(formData.amenities));
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
        await API.put(`/property/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Property Updated ");
      } else {
        // ADD
        await API.post("/property/add", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Property Added ");
      }

      navigate("/admin/properties");
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
      <h2 className="text-2xl font-bold mb-4">Add Property</h2>
      <button
        onClick={() => navigate("/admin/properties")}
        className="bg-gray-500 text-white px-3 py-1 rounded"
      >
        Cancel
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          type="text"
          placeholder="Title"
          value={formData.title}
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
          name="address"
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <Input
          name="city"
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />

        <Input
          name="price"
          placeholder="Price"
          type="number"
          value={formData.price}
          onChange={handleChange}
        />

        <Input
          name="deposit"
          placeholder="Deposit"
          type="number"
          value={formData.deposit}
          onChange={handleChange}
        />

        {/* Payment Frequency */}
        <select
          name="paymentFrequency"
          value={formData.paymentFrequency || "monthly"}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {/* Property Type */}
        <select
          name="propertyType"
          value={formData.propertyType || "Apartment"}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Villa">Villa</option>
          <option value="Shop">Shop</option>
        </select>

        {/* Bedrooms / Bathrooms */}
        <Input
          name="bedrooms"
          placeholder="Bedrooms"
          type="number"
          value={formData.bedrooms}
          onChange={handleChange}
        />
        <Input
          name="bathrooms"
          placeholder="Bathrooms"
          type="number"
          value={formData.bathrooms}
          onChange={handleChange}
        />

        <Input
          name="area"
          placeholder="Area (sq.ft)"
          type="number"
          value={formData.area}
          onChange={handleChange}
        />

        {/* Furnishing */}
        <select
          name="furnishing"
          onChange={handleChange}
          value={formData.furnishing || "Semi-Furnished"}
          className="w-full border p-2 rounded"
        >
          <option value="Furnished">Furnished</option>
          <option value="Semi-Furnished">Semi-Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>

        <Input
          name="floor"
          placeholder="Floor"
          type="number"
          value={formData.floor}
          onChange={handleChange}
        />
        
        <Input
          name="totalFloors"
          placeholder="Total Floors"
          type="number"
          value={formData.totalFloors}
          onChange={handleChange}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="parking"
            checked={formData.parking}
            onChange={handleParkingChange}
          />
          Parking
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label>
            <input
              type="checkbox"
              name="lift"
              checked={formData.amenities?.lift || false}
              onChange={handleAmenityChange}
            />
            Lift
          </label>

          <label>
            <input
              type="checkbox"
              name="gym"
              checked={formData.amenities?.gym || false}
              onChange={handleAmenityChange}
            />
            Gym
          </label>

          <label>
            <input
              type="checkbox"
              name="security"
              checked={formData.amenities?.security || false}
              onChange={handleAmenityChange}
            />
            Security
          </label>

          <label>
            <input
              type="checkbox"
              name="wifi"
              checked={formData.amenities?.wifi || false}
              onChange={handleAmenityChange}
            />
            WiFi
          </label>
        </div>

        <Input
          name="units"
          placeholder="Units"
          type="number"
          value={formData.units}
          onChange={handleChange}
        />

        <Input
          name="occupied"
          placeholder="Occupied Units"
          type="number"
          value={formData.occupied}
          onChange={handleChange}
        />

        <Input
          className="flex items-center gap-2"
          name="status"
          placeholder="Status"
          type="text"
          value={formData.status}
          onChange={handleChange}
        />
        <select
          className="flex items-center gap-2"
          name="status"
          value={formData.status || "available"}
          onChange={handleChange}
        >
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>

        <label className="flex items-center gap-2">
          <Input
            name="availableFrom"
            placeholder="Available From"
            type="date"
            value={formData.availableFrom}
            onChange={handleChange}
          />
          Available From
        </label>

        <div className="flex gap-3 flex-wrap mt-2">
          {/* Existing Images (Edit Mode) */}
          {existingImages.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={`http://localhost:5000/${img}`}
                alt="property"
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
          {id ? "Update Property" : "Add Property"}
        </Button>
      </form>
    </div>
  );
}
