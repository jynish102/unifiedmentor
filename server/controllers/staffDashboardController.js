const Maintenance = require("../models/Maintenance");

exports.getStaffDashboard = async (req, res) => {
  try {
    const staffId = req.user.id;

    // ALL ASSIGNED TASKS
    const maintenances = await Maintenance.find({
      assignedTo: staffId,
    })
      .populate("property", "title")
      .populate("amenity", "name")
      .populate("tenant", "fullname")
      .sort({ createdAt: -1 });

    // COUNTS
    const total = maintenances.length;

    const pending = maintenances.filter((m) => m.status === "pending").length;

    const assigned = maintenances.filter((m) => m.status === "assigned").length;

    const inProgress = maintenances.filter(
      (m) => m.status === "in-progress",
    ).length;

    const completed = maintenances.filter(
      (m) => m.status === "completed",
    ).length;

    // RECENT TASKS
    const recentTasks = maintenances.slice(0, 5);

    res.json({
      success: true,

      stats: {
        total,
        pending,
        assigned,
        inProgress,
        completed,
      },

      recentTasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
