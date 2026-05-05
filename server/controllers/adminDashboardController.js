const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");
const Maintenance = require("../models/Maintenance");

exports.getAdminDashboard = async (req, res) => {
  try {
    /* -------------------- STATS -------------------- */

    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Revenue (only paid)
    const revenueResult = await Booking.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$rentAmount" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const stats = [
      {
        title: "Total Users",
        value: totalUsers,
        change: "+0",
        icon: "Users",
        color: "bg-purple-500",
      },
      {
        title: "Total Properties",
        value: totalProperties,
        change: "+0",
        icon: "Building2",
        color: "bg-blue-500",
      },
      {
        title: "Bookings",
        value: totalBookings,
        change: "+0",
        icon: "TrendingUp",
        color: "bg-orange-500",
      },
      {
        title: "Revenue",
        value: `₹${totalRevenue}`,
        change: "+0",
        icon: "DollarSign",
        color: "bg-green-500",
      },
    ];

    /* -------------------- REVENUE CHART -------------------- */

    const revenueDataRaw = await Booking.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: { $month: "$startDate" },
          revenue: { $sum: "$rentAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const revenueData = months.map((m, i) => {
      const found = revenueDataRaw.find((r) => r._id === i + 1);
      return {
        month: m,
        revenue: found ? found.revenue : 0,
      };
    });

    /* -------------------- OCCUPANCY -------------------- */

    const occupancyAgg = await Property.aggregate([
      {
        $group: {
          _id: null,
          totalUnits: { $sum: "$units" },
          occupiedUnits: { $sum: "$occupied" },
        },
      },
    ]);

    const totalUnits = occupancyAgg[0]?.totalUnits || 0;
    const occupiedUnits = occupancyAgg[0]?.occupiedUnits || 0;

    const occupancyRate =
      totalUnits === 0 ? 0 : Math.round((occupiedUnits / totalUnits) * 100);

    const occupancyData = [{ month: "Current", rate: occupancyRate }];

    /* -------------------- PROPERTY TYPE -------------------- */

    const propertyTypeDataRaw = await Property.aggregate([
      {
        $group: {
          _id: "$propertyType",
          value: { $sum: 1 },
        },
      },
    ]);

    const propertyTypeData = propertyTypeDataRaw.map((item) => ({
      name: item._id || "Other",
      value: item.value,
    }));

    /* -------------------- RECENT ACTIVITY -------------------- */

    // latest bookings
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "fullname");

    const bookingActivity = bookings.map((b) => ({
      type: "Booking",
      description: `New booking by ${b.user?.fullname || "User"}`,
      time: b.createdAt,
    }));

    // latest maintenance
    const maintenance = await Maintenance.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const maintenanceActivity = maintenance.map((m) => ({
      type: "Maintenance",
      description: m.title,
      time: m.createdAt,
    }));

    // latest users
    const users = await User.find().sort({ createdAt: -1 }).limit(5);

    const userActivity = users.map((u) => ({
      type: "User",
      description: `${u.fullname} joined`,
      time: u.createdAt,
    }));

    const recentActivity = [
      ...bookingActivity,
      ...maintenanceActivity,
      ...userActivity,
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);

    /* -------------------- RESPONSE -------------------- */

    res.json({
      stats,
      revenueData,
      occupancyData,
      propertyTypeData,
      recentActivity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
