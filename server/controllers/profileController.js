const User = require("../models/User");
const Booking = require("../models/Booking");
const AmenityBooking = require("../models/AmenityBooking");

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. If NOT tenant → return only user
    if (user.role !== "tenant") {
      return res.json({
        user,
        counts: {
          active: 0,
          upcoming: 0,
          expired: 0,
        },
      });
    }

    // 3. If tenant → fetch booking
    const booking = await Booking.find({ user: userId }).populate(
      "property",
      "title address",
    );
    const today = new Date();

    let counts = {
      active: 0,
      upcoming: 0,
      expired: 0,
    };

    let latestBooking = null;
    let latestStatus = null; 

    booking.forEach((b) => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);

      let status = "upcoming";
      if (start <= today && end >= today) status = "active";
      else if (end < today) status = "expired";

      counts[status]++;

      // store latest booking (optional)
      if (!latestBooking || start > new Date(latestBooking.startDate)) {
        latestBooking = b;
        latestStatus = status;
      }
    });

    // 4. Fetch amenities
    const amenityBookings = await AmenityBooking.find({
      user: userId,
    }).populate("amenity", "name");

    const amenities = amenityBookings.map((a) => ({
      id: a._id,
      name: a.amenity?.name,
      status: a.status,
      date: a.date,
    }));

    // 5. Tenant response
    const tenantData = {
      ...user.toObject(),

      property: booking?.property?.title,
      address: booking?.property?.address,
      unit: booking?.unit,

      leaseStart: booking?.startDate,
      leaseEnd: booking?.endDate,

      rentAmount: booking?.rentAmount,
      deposit: booking?.deposit,

      status : latestStatus,

      amenities,
    };

    res.json({ user: tenantData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
