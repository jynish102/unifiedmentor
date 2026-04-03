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
        setFormData(res.data);
        setExistingImages(res.data.images || []);
      };

      fetchProperty();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length !== files.length) {
      alert("Only image files allowed!");
    }

    setImages(validImages);
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [name]: checked,
      },
      parking :{
        ...prev.parking,
        [name]: checked,
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      const token = localStorage.getItem("token");

      // append text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // old images (only for edit)
      if (id) {
        data.append("existingImages", JSON.stringify(existingImages));
      }

      // append images
      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }

      if (id) {
        // ✅ UPDATE
        await API.put(`${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Property Updated ✅");
      } else {
        // ✅ ADD
        await API.post("/property/add", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Property Added ✅");
      }

      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Property</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" placeholder="Title" onChange={handleChange} />

        <Input
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />

        <Input name="address" placeholder="Address" onChange={handleChange} />

        <Input name="city" placeholder="City" onChange={handleChange} />

        <Input
          name="price"
          placeholder="Price"
          type="number"
          onChange={handleChange}
        />

        <Input
          name="deposit"
          placeholder="Deposit"
          type="number"
          onChange={handleChange}
        />

        {/* Payment Frequency */}
        <select
          name="paymentFrequency"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {/* Property Type */}
        <select
          name="propertyType"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>Apartment</option>
          <option>House</option>
          <option>Villa</option>
          <option>Shop</option>
        </select>

        {/* Bedrooms / Bathrooms */}
        <Input
          name="bedrooms"
          placeholder="Bedrooms"
          type="number"
          onChange={handleChange}
        />
        <Input
          name="bathrooms"
          placeholder="Bathrooms"
          type="number"
          onChange={handleChange}
        />

        <Input
          name="area"
          placeholder="Area (sq.ft)"
          type="number"
          onChange={handleChange}
        />

        {/* Furnishing */}
        <select
          name="furnishing"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>Furnished</option>
          <option>Semi-Furnished</option>
          <option>Unfurnished</option>
        </select>

        <Input
          name="floor"
          placeholder="Floor"
          type="number"
          onChange={handleChange}
        />
        <Input
          name="totalFloors"
          placeholder="Total Floors"
          type="number"
          onChange={handleChange}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="parking"
            checked={formData.parking}
            onChange={handleAmenityChange}
          />
          Parking
        </label>
        

        <div className="grid grid-cols-2 gap-3">
          <label>
            <input
              type="checkbox"
              name="lift"
              checked={formData.amenities.lift}
              onChange={handleAmenityChange}
            />
            Lift
          </label>

          <label>
            <input
              type="checkbox"
              name="gym"
              checked={formData.amenities.gym}
              onChange={handleAmenityChange}
            />
            Gym
          </label>

          <label>
            <input
              type="checkbox"
              name="security"
              checked={formData.amenities.security}
              onChange={handleAmenityChange}
            />
            Security
          </label>

          <label>
            <input
              type="checkbox"
              name="wifi"
              checked={formData.amenities.wifi}
              onChange={handleAmenityChange}
            />
            WiFi
          </label>
        </div>

        <Input
          name="units"
          placeholder="Units"
          type="number"
          onChange={handleChange}
        />

        <Input
          name="occupied"
          placeholder="Occupied Units"
          type="number"
          onChange={handleChange}
        />

        <Input className="flex items-center gap-2"
          name="status"
          placeholder="Status"
          type="text"
          onChange={handleChange}
        />

        <label className="flex items-center gap-2">
        <Input
          name="availableFrom"
          placeholder="Available From"
          type="date"
          onChange={handleChange}
        />Available From
        </label>

        {/* Images */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        <Button type="submit" className="w-full">
          {id ? "Update Property" : "Add Property"}
        </Button>
      </form>
    </div>
  );
}
