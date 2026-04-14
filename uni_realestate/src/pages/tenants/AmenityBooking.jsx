import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function BookAmenity() {
  const navigate = useNavigate();
  const { amenityId } = useParams(); // amenityId
   console.log(amenityId);

  const [amenity, setAmenity] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    guests: 1,
    note: "",
  });

  // Fetch Amenity Details (for price)
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
 
  console.log({
    amenity: amenityId,
    
    ...formData,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);
      await API.post(
        "/amenity-bookings",
        {
          amenity: amenityId,
          date: formData.date,
          startTime: startDateTime,
          endTime: endDateTime,
          guests: formData.guests,
          note: formData.note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Booking successful ");
      navigate("/tenant/amenities");
    } catch (err) {
      console.error(err);
      alert("Booking failed ");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 shadow rounded-2xl">
      <h1 className="text-2xl font-bold mb-6">Book Amenity</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {/* Time */}
        <div className="flex gap-4">
          <Input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />

          <Input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        {/* Guests */}
        <Input
          type="number"
          name="guests"
          min="1"
          value={formData.guests}
          onChange={handleChange}
        />

        {/* Total Price (READ ONLY ) */}
        <p className="text-lg font-semibold">Total Price: ₹{amenity?.price}</p>

        {/* Note */}
        <Input
          type="text"
          name="note"
          placeholder="Special request (optional)"
          value={formData.note}
          onChange={handleChange}
        />

        {/* Submit */}
        <Button type="submit" className="w-full">
          Confirm Booking
        </Button>
      </form>
    </div>
  );
}
