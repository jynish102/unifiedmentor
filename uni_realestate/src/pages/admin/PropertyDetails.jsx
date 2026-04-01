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

      <p>
        <b>Address:</b> {property.address}, {property.city}
      </p>
      <p>
        <b>Type:</b> {property.propertyType}
      </p>
      <p>
        <b>Status:</b> {property.status}
      </p>
      <p>
        <b>Price:</b> ₹{property.price}
      </p>
    </div>
  );
}
