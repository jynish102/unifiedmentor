const Booking = require("../models/Booking");
const AmenityBooking = require("../models/AmenityBooking");

exports.getTenants = async (req, res) => {
  try {
    console.log("PROPERTY:", b.property);
    // 1 Fetch bookings
    const bookings = await Booking.find()
      .populate("user", "fullname email phone profileImage")
      .populate("property", "title address");
      

    // 2 Fetch all amenity bookings
    const amenityBookings = await AmenityBooking.find()
      .populate("amenity", "name")
      .populate("user", "_id");

    // 3 Group amenities by user
    const amenitiesByUser = {};

    amenityBookings.forEach((a) => {
      const userId = a.user?._id?.toString();
      if (!userId) return;

      if (!amenitiesByUser[userId]) {
        amenitiesByUser[userId] = [];
      }

      amenitiesByUser[userId].push({
        id: a._id,
        name: a.amenity?.name,
        status: a.status,
        date: a.date,
      });
    });

    const today = new Date();

    // 4 Filter confirmed bookings
    const validBookings = bookings;

    // 5 Map tenants
    const tenants = validBookings.map((b) => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);

      let status = "upcoming";
      if (start <= today && end >= today) status = "active";
      else if (end < today) status = "expired";

      const userId = b.user?._id?.toString();

      return {
        _id: userId,

        // user info
        name: b.user?.fullname,
        email: b.user?.email,
        phone: b.user?.phone,
        profileImage: b.user?.profileImage,

        // property info
        property: b.property?.title,
        address: b.property?.address || "N/A",
        unit: b.unit,

        //  lease
        leaseStart: b.startDate,
        leaseEnd: b.endDate,

        //  rent
        rentAmount: b.rentAmount,
        deposit: b.deposit,

        status,

        //  amenities
        amenities: amenitiesByUser[userId] || [],
      };
    });

    // 6 Remove duplicate tenants
    const uniqueTenants = Object.values(
      tenants.reduce((acc, tenant) => {
        if (tenant._id) {
          acc[tenant._id] = tenant;
        }
        return acc;
      }, {}),
    );

    // 7 Counts
    const counts = {
      total: uniqueTenants.length,
      active: 0,
      expired: 0,
      upcoming: 0,
    };

    uniqueTenants.forEach((t) => {
      counts[t.status]++;
    });

    // 8 Response
    res.json({
      tenants: uniqueTenants,
      counts,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
