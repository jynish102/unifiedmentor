import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const getImageUrl = (img) => {
    if (!img) return "/default-image.jpg";
    return `http://localhost:5000/${img.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
         const token = localStorage.getItem("token");
         console.log("ID:", id);
         console.log("TOKEN:", token);
         const res = await API.get(`/property/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProperty(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProperty();
  }, [id]);

  

  if (!property) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">{property.title}</h2>

      <button
        onClick={() => navigate(`/owner/amenities/add-amenity/${property._id}`)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Add Amenity
      </button>

      <button
        onClick={() => navigate("/owner/properties")}
        className="bg-gray-500 text-white px-3 py-1 rounded"
      >
        Close
      </button>

      <img
        src={getImageUrl(selectedImage || property.images?.[0])}
        className="w-full max-w-md rounded-lg"
        alt="property"
        onError={(e) => {
          e.target.src = "/default-image.jpg";
        }}
      />
      {/* Thumbnail Images */}
      <div className="flex gap-3 overflow-x-auto">
        {property.images?.map((img, index) => (
          <img
            key={index}
            src={getImageUrl(img)}
            alt="thumb"
            className="w-24 h-24 object-cover rounded-lg cursor-pointer border hover:scale-105 transition"
            onClick={() => setSelectedImage(img)}
            onError={(e) => {
              e.target.src = "/default-image.jpg";
            }}
          />
        ))}
      </div>

      <p>
        <b>Description:</b> {property.description}
      </p>
      <p>
        <b>Address:</b> {property.address}, {property.city}
      </p>
      <p>
        <b>Deposit:</b> {property.deposit}
      </p>
      {property.listingType === "rent" && property.paymentFrequency && (
        <p>
          <b>Payment Frequency:</b> {property.paymentFrequency}
        </p>
      )}
      <p>
        <b>Category:</b> {property.category}
      </p>

      <p>
        <b>Type:</b> {property.propertyType}
      </p>

      <p>
        <b>Listing Type:</b> {property.listingType}
      </p>

      <p>
        <b>Bedrooms:</b> {property.bedrooms}
      </p>
      <p>
        <b>Bathrooms:</b> {property.bathrooms}
      </p>
      <p>
        <b>Area:</b> {property.area} sq.ft
      </p>
      <p>
        <b>Furnishing:</b> {property.furnishing}
      </p>
      <p>
        <b>floor:</b> {property.floor}
      </p>
      <p>
        <b>Total Floors:</b> {property.totalFloors}
      </p>
      <p>
        <b>parking:</b> {property.parking ? "Yes" : "No"}
      </p>
      <p>
        <b>lift:</b> {property?.amenities?.lift ? "Yes" : "No"}
      </p>
      <p>
        <b>gym:</b> {property?.amenities?.gym ? "Yes" : "No"}
      </p>
      <p>
        <b>security:</b> {property?.amenities?.security ? "Yes" : "No"}
      </p>
      <p>
        <b>wifi:</b> {property?.amenities?.wifi ? "Yes" : "No"}
      </p>
      <p>
        <b>units:</b> {property.units}
      </p>
      <p>
        <b>occupied:</b> {property.occupied}
      </p>
      <p>
        <b>Available Units:</b> {property.availableUnits}
      </p>
      <p>
        <b>Status:</b> {property.status}
      </p>
      <p>
        <b>Available From:</b>{" "}
        {property?.availableFrom
          ? new Date(property.availableFrom).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "N/A"}
      </p>
    </div>
  );
}
