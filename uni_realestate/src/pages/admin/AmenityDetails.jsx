import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom"; 

export default function AmenityDetails() {
  const { id } = useParams();
  // console.log(id)
  const [amenity, setAmenity] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const getImageUrl = (img) => {
    if (!img) return "/default-image.jpg";
    return `http://localhost:5000/${img.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    const fetchAmenity = async () => {
      try {
        const res = await API.get(`/amenity/${id}`);
        setAmenity(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAmenity();
  }, [id]);

  if (!amenity) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() => navigate("/admin/amenities")}
        className="bg-gray-500 text-white px-3 py-1 rounded"
      >
        Close
      </button>
      {/* Title */}
      <h2 className="text-2xl font-bold">{amenity.name}</h2>

      {/* Main Image */}
      <img
        src={getImageUrl(selectedImage || amenity.images?.[0])}
        className="w-full max-w-md rounded-lg"
        alt="amenity"
        onError={(e) => {
          e.target.src = "/default-image.jpg";
        }}
      />

      {/* Thumbnail Images */}
      <div className="flex gap-3 overflow-x-auto">
        {amenity.images?.map((img, index) => (
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

      {/* Details */}
      <p>
        <b>Description:</b> {amenity.description}
      </p>

      <p>
        <b>Price:</b> ₹{amenity.price}
      </p>

      <p>
        <b>Capacity:</b> {amenity.capacity}
      </p>

      <p>
        <b>Location:</b> {amenity.location || "N/A"}
      </p>

      <p>
        <b>Operating Hours:</b>{" "}
        {amenity?.operatingHours?.start && amenity?.operatingHours?.end
          ? `${amenity.operatingHours.start} - ${amenity.operatingHours.end}`
          : "N/A"}
      </p>

      <p>
        <b>Status:</b> {amenity.status}
      </p>
      
      {amenity.status === "maintenance" && (
      <p>
        <b>Priority:</b> {amenity.priority || "medium"}
      </p>
      )}

      <p>
        <b>Upcoming Maintenance Date:</b> {amenity.upcomingMaintenanceDate || ""}
      </p>

      <p>
        <b>Created At:</b>{" "}
        {amenity?.createdAt
          ? new Date(amenity.createdAt).toLocaleDateString("en-IN")
          : "N/A"}
      </p>
    </div>
  );
}
