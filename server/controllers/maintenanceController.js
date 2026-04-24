const Maintenance = require("../models/Maintenance");
const Property = require("../models/Property");
const User = require("../models/User");

// CREATE MAINTENANCE REQUEST
exports.createMaintenance = async (req, res) => {
  try {
    const mongoose = require("mongoose");

    const propertyId = req.body.property;
    const userId = req.user.id;

    console.log("USER:", req.user);
    console.log("PROPERTY ID:", propertyId);

    // Validate property ID
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        message: "Invalid property ID",
      });
    }

    //  Check property exists
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    //  Create maintenance
    const maintenance = new Maintenance({
      property: propertyId,
      tenant: userId,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
    });

    await maintenance.save();

    res.status(201).json({
      success: true,
      data: maintenance,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL MAINTENANCE REQUESTS
exports.getAllMaintenance = async (req, res) => {
  const maintenance = await Maintenance.aggregate([
    // Priority logic
    {
      $addFields: {
        priorityValue: {
          $switch: {
            branches: [
              { case: { $eq: ["$priority", "emergency"] }, then: 4 },
              { case: { $eq: ["$priority", "high"] }, then: 3 },
              { case: { $eq: ["$priority", "medium"] }, then: 2 },
              { case: { $eq: ["$priority", "low"] }, then: 1 },
            ],
            default: 0,
          },
        },
      },
    },

    // Sort
    { $sort: { priorityValue: -1 } },

    // JOIN Property
    {
      $lookup: {
        from: "properties", // collection name in MongoDB
        localField: "property", // field in Maintenance
        foreignField: "_id", // field in Property
        as: "property",
      },
    },

    // convert array → object
    { $unwind: "$property" },

    // JOIN Tenant (User)
    {
      $lookup: {
        from: "users", // User collection
        localField: "tenant",
        foreignField: "_id",
        as: "tenant",
      },
    },

    // convert array → object
    { $unwind: "$tenant" },
  ]);

  res.json({
    success: true,
    data: maintenance,
  });
};

// GET MAINTENANCE BY PROPERTY
exports.getMaintenanceByProperty = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { propertyId } = req.params;

    //  1. Check property exists & belongs to owner
    const property = await Property.findOne({
      _id: propertyId,
      owner: ownerId,
    });

    if (!property) {
      return res.status(403).json({
        message: "Not authorized for this property",
      });
    }

    // 2. Get maintenance for that property
    const maintenance = await Maintenance.find({
      property: propertyId,
    })
      .populate("tenant", "fullname email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: maintenance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET MAINTENANCE BY TENANT
exports.getTenantMaintenance = async (req, res) => {
  const maintenance = await Maintenance.find({
    tenant: req.params.tenantId,
  });

  res.json({
    success: true,
    data: maintenance,
  });
};

//owner get my maintenance requests
exports.getOwnerMaintenance = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // 1. Get all owner properties
    const properties = await Property.find({ owner: ownerId });

    const propertyIds = properties.map((p) => p._id);

    // 2. Get all maintenance for those properties
    const maintenance = await Maintenance.find({
      property: { $in: propertyIds },
    })
      .populate("tenant", "fullname email")
      .populate("property", "title address")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: maintenance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE MAINTENANCE STATUS
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json({
      success: true,
      data: maintenance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE MAINTENANCE REQUEST
exports.deleteMaintenance = async (req, res) => {
  await Maintenance.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Maintenance request deleted",
  });
};
