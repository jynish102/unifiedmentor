import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast";

import {
  BedDouble,
  Bath,
  Square,
  IndianRupee,
  MapPin,
  Building2,
  ShieldCheck,
  Wifi,
  Dumbbell,
  Car,
  ArrowLeft,
  MessageCircle,
  CalendarCheck,
  CheckCircle2,
  X,
} from "lucide-react";

import { Button } from "../../components/ui/button";

export default function PropertyDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [property, setProperty] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

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

        if (res.data.images?.length > 0) {
          setSelectedImage(res.data.images[0]);
        }
      } catch (err) {
        console.log("Failed to fetch property",err.res?.data || err.message);
        toast.error(err.response?.data?.message || "Failed to fetch property");
      }
    };

    fetchProperty();
  }, [id]);

  const handleSend = async () => {
    if (!form.subject || !form.message) {
      return toast.error("All fields are required");
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/messages/contact-owner",
        {
          propertyId: property._id,
          subject: form.subject,
          message: form.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Message sent successfully");

      setForm({
        subject: "",
        message: "",
      });

      setOpen(false);
    } catch (err) {
      console.log("Failed to send message", err.res?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP SECTION */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* IMAGE SECTION */}
          <div className="bg-white rounded-3xl shadow-lg p-4">
            <img
              src={getImageUrl(selectedImage || property.images?.[0])}
              alt="property"
              className="w-full h-[450px] object-cover rounded-2xl"
              onError={(e) => {
                e.target.src = "/default-image.jpg";
              }}
            />

            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {property.images?.map((img, index) => (
                <img
                  key={index}
                  src={getImageUrl(img)}
                  alt="thumb"
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-24 rounded-xl object-cover cursor-pointer border-2 transition hover:scale-105 ${
                    selectedImage === img
                      ? "border-blue-600"
                      : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  {property.title}
                </h1>

                <div className="flex items-center gap-2 text-slate-500 mt-2">
                  <MapPin size={18} />

                  <p>
                    {property.address}, {property.city}, {property.state}
                  </p>
                </div>
              </div>

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                {property.status}
              </span>
            </div>

            {/* QUICK INFO */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <BedDouble size={18} />
                  Bedrooms
                </div>

                <h3 className="text-xl font-bold">{property.bedrooms}</h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Bath size={18} />
                  Bathrooms
                </div>

                <h3 className="text-xl font-bold">{property.bathrooms}</h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Square size={18} />
                  Area
                </div>

                <h3 className="text-xl font-bold">{property.area} sq.ft</h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <IndianRupee size={18} />
                  Deposit
                </div>

                <h3 className="text-xl font-bold">₹ {property.deposit}</h3>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>

              <p className="text-slate-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* PROPERTY INFO */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-sm text-slate-500">Property Type</p>

                <h3 className="font-semibold">{property.propertyType}</h3>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-sm text-slate-500">Listing Type</p>

                <h3 className="font-semibold">{property.listingType}</h3>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-sm text-slate-500">Furnishing</p>

                <h3 className="font-semibold">{property.furnishing}</h3>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-sm text-slate-500">Available Units</p>

                <h3 className="font-semibold">{property.availableUnits}</h3>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                onClick={() =>
                  navigate(`/tenant/properties/booking/${property._id}`)
                }
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                Book Property
              </Button>

              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="cursor-pointer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Owner
              </Button>

              <Button
                onClick={() => navigate("/tenant/properties")}
                variant="secondary"
                className="bg-slate-700 hover:bg-slate-800 text-amber-50 rounded-xl cursor-pointer"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        </div>

        {/* AMENITIES */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Amenities</h2>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-3">
              <Building2 className="text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">Lift</p>

                <h3 className="font-semibold">
                  {property?.amenities?.lift ? "Available" : "No"}
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-3">
              <Dumbbell className="text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">Gym</p>

                <h3 className="font-semibold">
                  {property?.amenities?.gym ? "Available" : "No"}
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-3">
              <ShieldCheck className="text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">Security</p>

                <h3 className="font-semibold">
                  {property?.amenities?.security ? "Available" : "No"}
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-3">
              <Wifi className="text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">Wifi</p>

                <h3 className="font-semibold">
                  {property?.amenities?.wifi ? "Available" : "No"}
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-3">
              <Car className="text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">Parking</p>

                <h3 className="font-semibold">
                  {property.parking ? "Available" : "No"}
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 flex items-center gap-3">
              <CheckCircle2 className="text-blue-600" />

              <div>
                <p className="text-sm text-slate-500">Available From</p>

                <h3 className="font-semibold">
                  {property?.availableFrom
                    ? new Date(property.availableFrom).toLocaleDateString(
                        "en-IN",
                      )
                    : "N/A"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT OWNER MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Contact Owner</h2>

                <p className="text-blue-100 text-sm mt-1">
                  Send your message directly
                </p>
              </div>

              <button onClick={() => setOpen(false)} className="cursor-pointer">
                <X />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Subject
                </label>

                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  placeholder="Enter subject"
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Message
                </label>

                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  placeholder="Write your message..."
                  className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="bg-slate-50 border-t px-6 py-5 flex justify-end gap-3">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
