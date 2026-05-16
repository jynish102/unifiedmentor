import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import toast from "react-hot-toast";

export default function AddBooking() {
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const [dateError, setDateError] = useState("");
  const [property, setProperty] = useState(null);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    rentAmount: "",
    paymentFrequency: "",
    status: "pending",
    paymentStatus: "pending",
  });

  // Fetch Property
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await API.get(`/property/${propertyId}`);

        setProperty(res.data);

        setFormData((prev) => ({
          ...prev,
          rentAmount: res.data.price,
          paymentFrequency: res.data.paymentFrequency,
        }));
      } catch (err) {
         console.log("Error Fetch Property Data", err.res?.data || err.message);
         toast.error(err.res?.data?.message || "Error Fetching Property Data");
      }
    };

    fetchProperty();
  }, [propertyId]);


  // status And availability Validation
  const isPropertyAvailable = () => {
    return property?.status === "available";
  };

  const isAvailableFromValid = (startDate) => {
    if (!property?.availableFrom) return true;

    return new Date(startDate) >= new Date(property.availableFrom);
  };

  // Validate Dates
  const validateDates = (start, end) => {
    if (!start || !end) {
      setDateError("");
      return;
    }

    if (new Date(start) >= new Date(end)) {
      setDateError("End date must be after start date");
      return;
    }

    if (!isAvailableFromValid(start)) {
      setDateError(
        `Property available after ${new Date(
          property.availableFrom,
        ).toLocaleDateString()}`,
      );
      return;
    }
    setDateError("");
  };

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    setFormData(updated);

    if (name === "startDate" || name === "endDate") {
      validateDates(
        name === "startDate" ? value : updated.startDate,
        name === "endDate" ? value : updated.endDate,
      );
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dateError) {
      toast.error("Please fix date errors");
      return;
    }

    if (!isPropertyAvailable(property)) {
      toast.error(`Property is currently ${property?.status}`);
      return;
    }
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/property-bookings",
        {
          property: propertyId,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Booking Requested");
      navigate("/tenant/properties");
    } catch (err) {
      console.log("Error creating booking",err.res?.data || err.message);
      toast.error(err.response?.data?.message || "Error creating booking");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold">Book Property</h2>

        <p className="text-white/80 text-sm mt-1">
          Fill booking details to request property booking
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-b-2xl shadow-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* BOOKING DATES */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Booking Dates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date*
                </label>

                <Input
                  autoFocus
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`h-11 ${dateError ? "border-red-500" : ""}`}
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date*
                </label>

                <Input
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`h-11 ${dateError ? "border-red-500" : ""}`}
                  required
                />

                {dateError && (
                  <p className="text-red-500 text-sm mt-2">{dateError}</p>
                )}
              </div>
            </div>
          </div>

          {/* RENT DETAILS */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Rent Information
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <p className="text-sm text-slate-500 mb-2">Rent Amount</p>

              <p className="text-3xl font-bold text-slate-900">
                ₹{formData.rentAmount?.toLocaleString()}
              </p>

              <p className="text-sm text-slate-500 mt-1 capitalize">
                Per {formData.paymentFrequency}
              </p>
            </div>
          </div>

          {/* BOOKING STATUS */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Booking Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8"
              // disabled={!dateError}
            >
              Request Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
