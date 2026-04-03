import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400";
    return `http://localhost:5000/${img.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await API.get(`/property/${id}`);
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

      <img
        src={getImageUrl(selectedImage || property.images?.[0])}
        className="w-full max-w-md rounded-lg"
        alt="property"
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
          />
        ))}
      </div>
      
      <p><b>Description:</b> {property.description}</p>
      <p>
        <b>Address:</b> {property.address}, {property.city}
      </p>
      <p>
        <b>Deposit:</b> {property.deposit}
      </p>
      <p>
        <b>paymentFrequency:</b> {property.paymentFrequency}
      </p>
      <p>
        <b>Type:</b> {property.propertyType}
      </p>
      <p><b>Bedrooms:</b> {property.bedrooms}</p>
      <p><b>Bathrooms:</b> {property.bathrooms}</p>
      <p><b>Area:</b> {property.area} sq.ft</p>
      <p><b>Furnishing:</b> {property.furnishing}</p>
      <p><b>floor:</b> {property.floor}</p>
      <p><b>Total Floors:</b> {property.totalFloors}</p>
      <p><b>parking:</b> {property.parking}</p>
      <p><b>lift:</b> {property.amenities.lift ? "Yes" : "No"}</p>
      <p><b>gym:</b> {property.amenities.gym ? "Yes" : "No"}</p>
      <p><b>security:</b> {property.amenities.security ? "Yes" : "No"}</p>
      <p><b>wifi:</b> {property.amenities.wifi ? "Yes" : "No"}</p>
      <p><b>units:</b> {property.units}</p>
      <p><b>occupied:</b> {property.occupied}</p>
      <p>
        <b>Status:</b> {property.status}
      </p>
      <p><b>available from:</b> {property.available}</p>
      
    </div>
  );
}
