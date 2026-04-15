import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function AddBooking() {
  const navigate = useNavigate();
  const { propertyId} = useParams();

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    rentAmount: "",
    status: "pending",
    paymentStatus: "pending",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      const res = await API.get(`/property/${propertyId}`);

      setFormData((prev) => ({
        ...prev,
        rentAmount: res.data.price,
        paymentFrequency: res.data.paymentFrequency,
        
      }));
    };

    fetchProperty();
  }, [propertyId]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Date validation
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert("End date must be after start date");
      return;
    }
    // console.log("PROPERTY ID:", propertyId);

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/bookings",
        {
          property: propertyId,
          
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Booking Requested ");
      navigate("/tenant/properties");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating booking");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Book Property</h2>

      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 text-white px-3 py-1 rounded mb-3"
      >
        Cancel
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Date */}
        <Input
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
        />

        {/* End Date */}
        <Input
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
        />

        {/* Rent Amount */}
       
          <p className="text-sm text-slate-500">Rent</p>
          <p className="text-lg font-bold text-slate-900">
            ₹{formData.rentAmount?.toLocaleString()} / {formData.paymentFrequency}
          </p>
      

        {/* status */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* paymentStatus */}
        <select
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        <Button type="submit" className="w-full">
          Request Booking
        </Button>
      </form>
    </div>
  );
}
