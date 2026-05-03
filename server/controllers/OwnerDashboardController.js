const User = require("../models/User");
const Property = require("../models/Property");
const Amenity = require("../models/Amenity");
const Booking = require("../models/Booking");
const AmenityBooking = require("../models/AmenityBooking");
const Maintenance = require("../models/Maintenance");
const mongoose = require("mongoose");

exports.getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id; // Ensure we get the correct ID
    const propertyIds = await Property.find({ owner: ownerId }).distinct("_id");

    /*------------------------- User Data-------------------------------------- */
    //  1. Total Staff
    const totalStaff = await User.countDocuments({
      owner: ownerId,
      role: "staff",
      isActive: true,
    });

    // 2. Recent Staff Activity (optional but useful)
    const recentStaff = await User.find({
      owner: ownerId,
      role: "staff",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullname email createdAt");

    // Format activity
    const staffActivity = recentStaff.map((staff) => ({
      type: "staff",
      message: `New staff added: ${staff.fullname}`,
      date: staff.createdAt,
    }));

    /*------------------------- Property Data-------------------------------------- */
    //  1. Total Properties
    const totalProperties = await Property.countDocuments({
      owner: ownerId,
    });

    //  2. Total Units & Occupied Units
    const unitsData = await Property.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(ownerId),
        },
      },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: "$units" },
          occupiedUnits: { $sum: "$occupied" },
        },
      },
    ]);

    const totalUnits = unitsData[0]?.totalUnits || 0;
    const occupiedUnits = unitsData[0]?.occupiedUnits || 0;

    const occupancyRate =
      totalUnits === 0 ? 0 : Math.round((occupiedUnits / totalUnits) * 100);

    //  3. Property Status Count
    const statusStats = await Property.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(ownerId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // convert to object
    const statusData = {};
    statusStats.forEach((item) => {
      statusData[item._id] = item.count;
    });

    //  4. Property Type Distribution (for Pie Chart)
    const propertyTypeData = await Property.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(ownerId) } },
      {
        $group: {
          _id: "$propertyType",
          value: { $sum: 1 },
        },
      },
    ]);
    
    // console.log("unitsData:", unitsData);
    // console.log("totalUnits:", totalUnits);
    // console.log("occupiedUnits:", occupiedUnits);

    
    /*------------------------- Booking Data-------------------------------------- */
    const tenants = await Booking.distinct("user", {
      property: { $in: propertyIds },
      status: "approved",
    });

    const totalTenants = tenants.length;

    const revenueResult = await Booking.aggregate([
      {
        $match: {
          property: { $in: propertyIds },
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$rentAmount" },
        },
      },
    ]);

    const totalExpectedRevenue = revenueResult[0]?.totalRevenue || 0;

    const revenueChart = await Booking.aggregate([
      {
        $match: {
          property: { $in: propertyIds },
          status: "approved",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$rentAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const pendingPayments = await Booking.countDocuments({
      property: { $in: propertyIds },
      paymentStatus: "pending",
    });

    const recentBookings = await Booking.find({
      property: { $in: propertyIds },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "fullname")
      .select("user rentAmount paymentStatus createdAt");

    const bookingActivity = recentBookings.map((b) => ({
      type: "booking",
      message:
        b.paymentStatus === "paid"
          ? `Payment received: ₹${b.rentAmount}`
          : `New booking by ${b.user?.fullname}`,
      date: b.createdAt,
    }));

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const currentMonthRevenue = await Booking.aggregate([
      {
        $match: {
          property: { $in: propertyIds },
          status: "approved",
          createdAt: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lt: new Date(currentYear, currentMonth, 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$rentAmount" },
        },
      },
    ]);
    // console.log("propertyIds:", propertyIds);
    // console.log("revenueResult:", revenueResult);
    // console.log("revenueChart:", revenueChart);

    const monthlyExpectedRevenue = currentMonthRevenue[0]?.total || 0;

    /*------------------------- Maintenance Data-------------------------------------- */
    const totalIssues = await Maintenance.countDocuments({
      property: { $in: propertyIds },
    });

    const pendingIssues = await Maintenance.countDocuments({
      property: { $in: propertyIds },
      status: { $in: ["pending", "assigned", "in-progress"] },
    });

    const completedIssues = await Maintenance.countDocuments({
      property: { $in: propertyIds },
      status: "completed",
    });

    const priorityStats = await Maintenance.aggregate([
      {
        $match: { property: { $in: propertyIds } },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityData = {};
    priorityStats.forEach((p) => {
      priorityData[p._id] = p.count;
    });

    const recentMaintenance = await Maintenance.find({
      property: { $in: propertyIds },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("tenant", "fullname")
      .select("title status tenant createdAt");

    const maintenanceActivity = recentMaintenance.map((m) => ({
      type: "maintenance",
      message: `Issue: ${m.title} (${m.status})`,
      date: m.createdAt,
    }));

    const allActivity = [
      ...staffActivity,
      ...bookingActivity,
      ...maintenanceActivity,
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
      .map((item) => ({
        ...item,
        time: new Date(item.date).toLocaleString(),
      }));

    //  Response (ONLY user-related data for now)
    res.json({
      staff: {
        total: totalStaff,
      },

      properties: {
        total: totalProperties,
        totalUnits,
        occupiedUnits,
        occupancyRate,
        status: statusData,
        typeDistribution: propertyTypeData,
      },

      bookings: {
        totalTenants,
        totalRevenue: totalExpectedRevenue,
        pendingPayments,
        revenueChart,
      },

      maintenance: {
        total: totalIssues,
        pending: pendingIssues,
        completed: completedIssues,
        priority: priorityData,
      },

      activity: allActivity,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
