const Property = require("../models/Property");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Maintenance = require("../models/Maintenance");
const AmenityBooking = require("../models/AmenityBooking");

exports.getAdminDashboard = async (req, res) => {
  try {
    // Counts
    const totalProperties = await Property.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalAmenityBookings = await AmenityBooking.countDocuments();

    // Maintenance stats
    const pendingMaintenance = await Maintenance.countDocuments({
      status: "pending",
    });

    const completedMaintenance = await Maintenance.countDocuments({
      status: "completed",
    });

    // Revenue (simple sum of rentAmount)
    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$rentAmount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        totalProperties,
        totalUsers,
        totalBookings,
        totalAmenityBookings,
        pendingMaintenance,
        completedMaintenance,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// user Dashboard Api
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 from JWT

    // 1️⃣ Property Bookings
    const myBookings = await Booking.find({ user: userId })
      .populate("property", "title address")
      .sort({ createdAt: -1 });

    // 2️⃣ Amenity Bookings
    const myAmenityBookings = await AmenityBooking.find({ user: userId })
      .populate("amenity", "name")
      .sort({ createdAt: -1 });

    // 3️⃣ Maintenance Requests
    const myMaintenance = await Maintenance.find({ tenant: userId })
      .populate("property", "title")
      .sort({ createdAt: -1 });

    // 4️⃣ Counts (for dashboard cards)
    const totalBookings = myBookings.length;
    const totalAmenityBookings = myAmenityBookings.length;

    const pendingMaintenance = myMaintenance.filter(
      (m) => m.status === "pending",
    ).length;

    res.json({
      success: true,
      data: {
        totalBookings,
        totalAmenityBookings,
        pendingMaintenance,
        myBookings,
        myAmenityBookings,
        myMaintenance,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

