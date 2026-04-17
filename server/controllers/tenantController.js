
const Property = require("../models/Property");
const User = require("../models/User");

const Booking = require("../models/Booking");

exports.getTenants = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user").populate("property");

    const today = new Date();

    // ✅ 1. Only confirmed bookings
    const validBookings = bookings.filter((b) => b.status === "confirmed");

    // ✅ 2. Map tenants with dynamic status
    const tenants = validBookings.map((b) => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);

      let status = "upcoming";
      if (start <= today && end >= today) status = "active";
      else if (end < today) status = "expired";

      return {
        _id: b.user?._id, // ✅ important for unique users
        name: b.user?.name,
        email: b.user?.email,
        phone: b.user?.phone,
        property: b.property?.title,
        unit: b.unit,
        leaseStart: b.startDate,
        leaseEnd: b.endDate,
        rentAmount: b.rentAmount,
        status,
      };
    });

    // 3. Remove duplicate users
    const uniqueTenants = Object.values(
      tenants.reduce((acc, tenant) => {
        if (tenant._id) {
          acc[tenant._id] = tenant;
        }
        return acc;
      }, {}),
    );

    //  4. Status counts (dynamic)
    const counts = {
      total: uniqueTenants.length,
      active: 0,
      expired: 0,
      upcoming: 0,
    };

    uniqueTenants.forEach((t) => {
      counts[t.status]++;
    });

    // 5. Final response
    res.json({
      tenants: uniqueTenants,
      counts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
