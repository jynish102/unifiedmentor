const Maintenance = require("../models/Maintenance");
const Property = require("../models/Property");

// CREATE MAINTENANCE REQUEST
exports.createMaintenance = async (req, res) => {
  try {
    const property = await Property.findById(req.body.property);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const maintenance = new Maintenance({
      property: req.body.property,
      tenant: req.body.tenant,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority
    });

    await maintenance.save();

    res.status(201).json({
      success: true,
      data: maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL MAINTENANCE REQUESTS
exports.getAllMaintenance = async (req, res) => {
  const maintenance = await Maintenance.aggregate([
    // ✅ Priority logic
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

    // ✅ Sort
    { $sort: { priorityValue: -1 } },

    // ✅ JOIN Property
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

    // ✅ JOIN Tenant (User)
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
  const maintenance = await Maintenance.find({
    property: req.params.propertyId,
  });

  res.json({
    success: true,
    data: maintenance,
  });
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

// UPDATE MAINTENANCE STATUS
exports.updateMaintenanceStatus = async (req, res) => {
  const maintenance = await Maintenance.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );

  res.json({
    success: true,
    data: maintenance,
  });
};

// DELETE MAINTENANCE REQUEST
exports.deleteMaintenance = async (req, res) => {
  await Maintenance.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Maintenance request deleted",
  });
};
