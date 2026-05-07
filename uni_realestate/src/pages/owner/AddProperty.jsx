import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import toast from "react-hot-toast";
import {
  Home,
  MapPin,
  DollarSign,
  Bath,
  Square,
  Bed,
  Upload,
} from "lucide-react";

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
    category: "residential",
    propertyType: "Apartment",
    listingType: "rent",
    bedrooms: 0,
    bathrooms: 0,
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
        const token = localStorage.getItem("token");
        const res = await API.get(`/property/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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
          category: data.category || "residential",
          propertyType: data.propertyType || "Apartment",
          listingType: data.listingType || "rent",
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
      toast.error("Max 5 images allowed");
      return;
    }
     
    
    if (Number(formData.occupied) > Number(formData.units)) {
      toast.error("Occupied cannot exceed total units");
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
        toast.success("Property Updated ");
      } else {
        // ADD
        await API.post("/property/add", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Property Added ");
      }

      navigate("/owner/properties");
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || // backend message
        err.message || // axios error
        "Something went wrong ";

      toast.error(message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              {id ? "Update Property" : "Add New Property"}
            </h2>
            <p className="text-sm text-white/80 mt-1">
              Fill all required details for your property listing
            </p>
          </div>

        
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow-2xl rounded-b-2xl p-8 space-y-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ================= BASIC INFO ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title*
                </label>

                <Input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="h-11 w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  placeholder="e.g., Luxury Downtown Apartment"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type*
                </label>

                <select
                  name="propertyType"
                  value={formData.propertyType || "Apartment"}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Shop">Shop</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="land">Land</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Category
                </label>

                <select
                  name="category"
                  value={formData.category || "residential"}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Type
                </label>

                <select
                  name="listingType"
                  value={formData.listingType || "rent"}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                </select>
              </div>
            </div>
          </div>

          {/* ================= LOCATION ================= */}
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address*
                </label>

                <Input
                  name="address"
                  type="text"
                  placeholder="Full Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="h-11 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mx-1 mb-2">
                  City*
                </label>

                <Input
                  name="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="h-11  px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mx-1 mb-2">
                  City*
                </label>

                <Input
                  name="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="h-11  px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mx-1 mb-2">
                  City*
                </label>

                <Input
                  name="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="h-11  px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div> */}
            </div>
          </div>

          {/* ================= PRICING ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Pricing Details*
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>

                <Input
                  name="price"
                  type="number"
                  placeholder="50000"
                  value={formData.price}
                  onChange={handleChange}
                  className="h-11 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit
                </label>

                <Input
                  name="deposit"
                  type="number"
                  placeholder="10000"
                  value={formData.deposit}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              {formData.listingType === "rent" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Frequency
                  </label>

                  <select
                    name="paymentFrequency"
                    value={formData.paymentFrequency || "monthly"}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* ================= PROPERTY DETAILS ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Property Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>

                <Input
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms || ""}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>

                <Input
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms || ""}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sq.ft)
                </label>

                <Input
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* ================= BUILDING INFO ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Building Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Furnishing
                </label>

                <select
                  name="furnishing"
                  onChange={handleChange}
                  value={formData.furnishing || "Semi-Furnished"}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor
                </label>

                <Input
                  name="floor"
                  type="number"
                  value={formData.floor}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Floors
                </label>

                <Input
                  name="totalFloors"
                  type="number"
                  value={formData.totalFloors}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* ================= AMENITIES ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Description
            </h3>

            <textarea
              name="description"
              type="text"
              placeholder="Short description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border  rounded-lg focus:ring-2 focus:ring-black-900 focus:border-transparent outline-none transition resize-y min-h-[150px]"
            />
          </div>

          {/* ================= AMENITIES ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Amenities
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleParkingChange}
                />
                Parking
              </label>

              <label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="lift"
                  checked={formData.amenities?.lift || false}
                  onChange={handleAmenityChange}
                />
                Lift
              </label>

              <label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="gym"
                  checked={formData.amenities?.gym || false}
                  onChange={handleAmenityChange}
                />
                Gym
              </label>

              <label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="security"
                  checked={formData.amenities?.security || false}
                  onChange={handleAmenityChange}
                />
                Security
              </label>

              <label className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="wifi"
                  checked={formData.amenities?.wifi || false}
                  onChange={handleAmenityChange}
                />
                WiFi
              </label>
            </div>
          </div>

          {/* ================= STATUS ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Availability & Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Units
                </label>

                <Input
                  name="units"
                  type="number"
                  value={formData.units || 1}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupied Units
                </label>

                <Input
                  name="occupied"
                  type="number"
                  value={formData.occupied || 0}
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
                  value={formData.status || "available"}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="booked">Booked</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>
          </div>

          {/* ================= IMAGE UPLOAD ================= */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Property Images
            </h3>

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

            <div className="flex gap-4 flex-wrap mt-6">
              {existingImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={`http://localhost:5000/${img}`}
                    alt="property"
                    className="w-28 h-28 rounded-xl object-cover shadow"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
                  >
                    ×
                  </button>
                </div>
              ))}

              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={file.preview}
                    alt="preview"
                    className="w-28 h-28 rounded-xl object-cover shadow"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ================= BUTTON ================= */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              onClick={() => navigate("/owner/properties")}
              variant="outline"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {id ? "Update Property" : "Publish Property"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
