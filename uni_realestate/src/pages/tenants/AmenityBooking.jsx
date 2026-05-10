import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import toast from "react-hot-toast";

export default function BookAmenity() {
  const navigate = useNavigate();
  const { amenityId } = useParams();

  const [amenity, setAmenity] = useState(null);
  const [timeError, setTimeError] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    guests: 1,
    note: "",
    status: "pending",
    paymentStatus: "pending",
  });

  // Fetch Amenity
  useEffect(() => {
    const fetchAmenity = async () => {
      try {
        const res = await API.get(`/amenity/${amenityId}`);
        setAmenity(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAmenity();
  }, [amenityId]);

  const validateAmenityHours = (start, end) => {
    if (!amenity?.operatingHours) return true;

    const open = amenity.operatingHours.start;
    const close = amenity.operatingHours.end;
    const closesNextDay = amenity.operatingHours.closesNextDay;

    // Same-day amenity
    if (!closesNextDay) {
      if (start < open || end > close) {
        setTimeError(`Amenity available only between ${open} and ${close}`);
        return false;
      }
    }

    // Cross-midnight amenity
    else {
      const valid = start >= open || start <= close;

      if (!valid) {
        setTimeError(
          `Amenity available between ${open} and ${close} (Next Day)`,
        );
        return false;
      }
    }

    setTimeError("");
    return true;
  };

  // Validate Time
 const validateTime = (start, end, closesNextDay) => {
   if (!start || !end) {
     setTimeError("");
     return;
   }

   // Same time not allowed
   if (start === end) {
     setTimeError("Start and end time cannot be same");
     return;
   }

   // Same-day validation only
   if (!closesNextDay && start > end) {
     setTimeError("End time must be after start time");
     return;
   }

   setTimeError("");
 };

 const formatTime = (time) => {
   if (!time) return "";

   const [hour, minute] = time.split(":");

   const h = parseInt(hour);

   const ampm = h >= 12 ? "PM" : "AM";

   const formattedHour = h % 12 || 12;

   return `${formattedHour}:${minute} ${ampm}`;
 };

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Guests validation
    if (name === "guests" && value < 1) return;

    const updated = {
      ...formData,
      [name]: value,
    };

    setFormData(updated);

    // Validate Time
    if (name === "startTime" || name === "endTime") {
      validateTime(
        name === "startTime" ? value : updated.startTime,
        name === "endTime" ? value : updated.endTime,
        amenity?.operatingHours?.closesNextDay,
      );
       validateAmenityHours(
         name === "startTime" ? value : updated.startTime,
         name === "endTime" ? value : updated.endTime,
       );
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timeError) {
      toast.error("Please fix time errors");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);

      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      // Overnight booking support
      
      if (formData.closesNextDay) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }

      await API.post(
        "/amenity-bookings",
        {
          amenity: amenityId,
          date: formData.date,
          startTime: startDateTime,
          endTime: endDateTime,
          guests: formData.guests,
          note: formData.note,
          status: formData.status,
          paymentStatus: formData.paymentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Booking Requested");
      navigate("/tenant/amenities");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold">Book Amenity</h2>

        <p className="text-sm text-white/80 mt-1">
          Fill booking details for your amenity reservation
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-b-2xl shadow-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* BOOKING DETAILS */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Booking Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Date*
                </label>

                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guests*
                </label>

                <Input
                  type="number"
                  name="guests"
                  min="1"
                  value={formData.guests}
                  onChange={handleChange}
                  className="h-11"
                  required
                />
              </div>
            </div>
          </div>

          {/* TIME */}
          <div>
            <p className="text-lg text-slate-500 mb-3">
              Available:{"  "}
              {formatTime(amenity?.operatingHours?.start)} -
              {formatTime(amenity?.operatingHours?.end)}
              {amenity?.operatingHours?.closesNextDay && " (Next Day)"}
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Time Slot
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time*
                </label>

                <Input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`h-11 ${timeError ? "border-red-500" : ""}`}
                  required
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time*
                </label>

                <Input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`h-11 ${timeError ? "border-red-500" : ""}`}
                  required
                />

                {timeError && (
                  <p className="text-red-500 text-sm mt-2">{timeError}</p>
                )}
              </div>
            </div>
          </div>

          {/* PRICE */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Price Information
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <p className="text-sm text-slate-500 mb-2">Booking Price</p>

              <p className="text-3xl font-bold text-slate-900">
                ₹{amenity?.price?.toLocaleString() || 0}
              </p>

              <p className="text-sm text-slate-500 mt-1">Per Booking</p>
            </div>
          </div>

          {/* NOTE */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Additional Note
            </h3>

            <textarea
              name="note"
              placeholder="Special requests or notes..."
              value={formData.note}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* STATUS */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Booking Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Booking Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>

                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/tenant/amenities")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!!timeError}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              Request Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
