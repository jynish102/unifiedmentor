import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";

import {
  ArrowLeft,
  MapPin,
  Clock3,
  Users,
  IndianRupee,
  CalendarDays,
  ShieldAlert,
  CheckCircle,
  Wrench,
} from "lucide-react";

export default function AmenityDetails() {
  const { id } = useParams();

  const [amenity, setAmenity] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const getImageUrl = (img) => {
    if (!img) return "/default-image.jpg";

    return `http://localhost:5000/${img.replace(/\\/g, "/")}`;
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hour, minute] = time.split(":");

    const h = parseInt(hour);

    const ampm = h >= 12 ? "PM" : "AM";

    const formattedHour = h % 12 || 12;

    return `${formattedHour}:${minute} ${ampm}`;
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";

      case "maintenance":
        return "bg-orange-100 text-orange-700";

      case "inactive":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (!amenity) {
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
              {amenity.name}
            </h1>

            <div className="flex items-center gap-2 text-slate-500 mt-2">
              <MapPin size={18} />

              <p>{amenity.location || "No location available"}</p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/owner/amenities")}
            className="bg-slate-700 hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        </div>

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* IMAGE SECTION */}
          <div>
            {/* MAIN IMAGE */}
            <img
              src={getImageUrl(
                selectedImage ||
                  (amenity.images?.length > 0 ? amenity.images[0] : null),
              )}
              alt="amenity"
              className="w-full h-[500px] object-cover rounded-3xl shadow-lg"
              onError={(e) => {
                e.target.src = "/default-image.jpg";
              }}
            />

            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {amenity.images?.map((img, index) => (
                <img
                  key={index}
                  src={getImageUrl(img)}
                  alt="thumb"
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-24 rounded-2xl object-cover cursor-pointer border-4 transition hover:scale-105
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
              <p className="text-slate-500">Booking Price</p>

              <div className="flex items-center gap-2 mt-2">
                <IndianRupee className="text-blue-700" size={28} />

                <h2 className="text-4xl font-bold text-blue-700">
                  {amenity.price}
                </h2>
              </div>
            </div>

            {/* STATUS */}
            <div className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Status</h2>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusStyle(
                    amenity.status,
                  )}`}
                >
                  {amenity.status}
                </span>
              </div>

              {amenity.status === "maintenance" && (
                <div className="mt-4 flex items-center gap-2 text-orange-700">
                  <Wrench size={18} />

                  <p className="capitalize">
                    Priority: {amenity.priority || "medium"}
                  </p>
                </div>
              )}
            </div>

            {/* QUICK INFO */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Users size={18} />
                  Capacity
                </div>

                <h3 className="text-2xl font-bold mt-2">{amenity.capacity}</h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock3 size={18} />
                  Operating
                </div>

                <h3 className="text-sm font-semibold mt-2">
                  {amenity?.operatingHours?.start &&
                  amenity?.operatingHours?.end
                    ? `${formatTime(
                        amenity.operatingHours.start,
                      )} - ${formatTime(amenity.operatingHours.end)}`
                    : "N/A"}
                </h3>
              </div>
            </div>

            {/* EXTRA DETAILS */}
            <div className="bg-white rounded-3xl shadow-md p-6 space-y-4">
              <h2 className="text-xl font-bold">Amenity Details</h2>

              <div className="space-y-3 text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />

                  <p>
                    <b>Status:</b> {amenity.status}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-blue-600" />

                  <p>
                    <b>Created:</b>{" "}
                    {amenity?.createdAt
                      ? new Date(amenity.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                        })
                      : "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-orange-600" />

                  <p>
                    <b>Upcoming Maintenance:</b>{" "}
                    {amenity.upcomingMaintenanceDate
                      ? new Date(
                          amenity.upcomingMaintenanceDate,
                        ).toLocaleString("en-IN", {
                          dateStyle: "medium",
                      
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Description</h2>

          <p className="text-slate-600 leading-8">
            {amenity.description || "No description available"}
          </p>
        </div>
      </div>
    </div>
  );
}
