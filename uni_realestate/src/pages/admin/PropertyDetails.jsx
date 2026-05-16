import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import toast from "react-hot-toast"

import {
  BedDouble,
  Bath,
  Maximize,
  Building2,
  MapPin,
  Wifi,
  ShieldCheck,
  Dumbbell,
  Car,
  ArrowLeft,
  Plus,
} from "lucide-react";

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

        const res = await API.get(`/property/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProperty(res.data);
      } catch (err) {
        console.error("Error",err.response?.data || err.message);
        toast.error(err.response?.data?.message || "error");
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-slate-500 mt-2">
              <MapPin size={18} />
              <p>
                {property.address}, {property.city}, {property.state}
              </p>
            </div>
          </div>

          <div className="flex gap-3">

            <Button
              onClick={() => navigate("/owner/properties")}
              className="bg-slate-700 hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back
            </Button>
          </div>
        </div>

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* IMAGE SECTION */}
          <div>
            {/* MAIN IMAGE */}
            <img
              src={getImageUrl(
                selectedImage ||
                  (property.images?.length > 0 ? property.images[0] : null),
              )}
              alt="property"
              className="w-full h-[500px] object-cover rounded-3xl shadow-lg"
              onError={(e) => {
                e.target.src = "/default-image.jpg";
              }}
            />

            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {property.images?.map((img, index) => (
                <img
                  key={index}
                  src={getImageUrl(img)}
                  alt="thumb"
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-24 rounded-2xl object-cover cursor-pointer border-4 transition duration-200 hover:scale-105
                    ${
                      selectedImage === img || (!selectedImage && index === 0)
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                  onError={(e) => {
                    e.target.src = "/default-image.jpg";
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT INFO */}
          <div className="space-y-6">
            {/* PRICE CARD */}
            <div className="bg-white rounded-3xl shadow-md p-6">
              <p className="text-slate-500">Security Deposit</p>

              <h2 className="text-4xl font-bold text-blue-700 mt-2">
                ₹ {property.deposit}
              </h2>

              {property.listingType === "rent" && property.paymentFrequency && (
                <p className="mt-2 text-slate-600 capitalize">
                  Payment: {property.paymentFrequency}
                </p>
              )}
            </div>

            {/* PROPERTY INFO */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <BedDouble size={18} />
                  Bedrooms
                </div>

                <h3 className="text-2xl font-bold mt-2">{property.bedrooms}</h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Bath size={18} />
                  Bathrooms
                </div>

                <h3 className="text-2xl font-bold mt-2">
                  {property.bathrooms}
                </h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Maximize size={18} />
                  Area
                </div>

                <h3 className="text-2xl font-bold mt-2">
                  {property.area} sq.ft
                </h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Building2 size={18} />
                  Furnishing
                </div>

                <h3 className="text-2xl font-bold mt-2 capitalize">
                  {property.furnishing}
                </h3>
              </div>
            </div>

            {/* EXTRA DETAILS */}
            <div className="bg-white rounded-3xl shadow-md p-6 space-y-3">
              <h2 className="text-xl font-bold">Property Details</h2>

              <div className="grid grid-cols-2 gap-y-3 text-slate-700">
                <p>
                  <b>Category:</b> {property.category}
                </p>

                <p>
                  <b>Type:</b> {property.propertyType}
                </p>

                <p>
                  <b>Floor:</b> {property.floor}
                </p>

                <p>
                  <b>Total Floors:</b> {property.totalFloors}
                </p>

                <p>
                  <b>Units:</b> {property.units}
                </p>

                <p>
                  <b>Occupied:</b> {property.occupied}
                </p>

                <p>
                  <b>Available Units:</b> {property.availableUnits}
                </p>

                <p>
                  <b>Status:</b> {property.status}
                </p>

                <p>
                  <b>Parking:</b> {property.parking ? "Yes" : "No"}
                </p>

                <p>
                  <b>Listing Type:</b> {property.listingType}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Description</h2>

          <p className="text-slate-600 leading-8">{property.description}</p>
        </div>

        {/* AMENITIES */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Amenities</h2>

          <div className="flex flex-wrap gap-4">
            {property?.amenities?.wifi && (
              <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-100 text-blue-700">
                <Wifi size={18} />
                WiFi
              </div>
            )}

            {property?.amenities?.security && (
              <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-green-100 text-green-700">
                <ShieldCheck size={18} />
                Security
              </div>
            )}

            {property?.amenities?.gym && (
              <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-purple-100 text-purple-700">
                <Dumbbell size={18} />
                Gym
              </div>
            )}

            {property?.amenities?.lift && (
              <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-orange-100 text-orange-700">
                🛗 Lift
              </div>
            )}

            {property?.parking && (
              <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-200 text-slate-700">
                <Car size={18} />
                Parking
              </div>
            )}
          </div>
        </div>

        {/* AVAILABLE DATE */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Availability</h2>

          <p className="text-slate-700 text-lg">
            Available From:{" "}
            <span className="font-semibold">
              {property?.availableFrom
                ? new Date(property.availableFrom).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
