import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function AddProperty() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    price: "",
    deposit: "",
    propertyType: "Apartment",
    bedrooms: "",
    bathrooms: "",
    area: "",
    furnishing: "Semi-Furnished",
    rentType: "monthly",
  });

  const [images, setImages] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      const token = localStorage.getItem("token");

      // append text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // append images
      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }

      await API.post("/property/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Property Added ✅");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Error adding property");
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

        {/* Rent Type */}
        <select
          name="rentType"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {/* Images */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        <Button type="submit" className="w-full">
          Add Property
        </Button>
      </form>
    </div>
  );
}
