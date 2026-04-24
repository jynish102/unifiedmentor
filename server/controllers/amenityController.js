const Amenity = require("../models/Amenity");
const Property = require("../models/Property");

exports.createAmenity = async (req, res) => {
  try {
    
    const propertyId = req.params.propertyId;
    const ownerId = req.user.id;

    //  CHECK: property belongs to owner
    const property = await Property.findOne({
      _id: propertyId,
      owner: ownerId,
    });

    if (!property) {
      return res.status(403).json({
        message: "Not authorized to add amenity to this property",
      });
    }

     if (!req.body) {
       return res.status(400).json({ message: "No data received" });
     }
    const imagePaths = req.files?.map((file) => file.path) || [];

    let operatingHours = {};
    // fix object field
    if (req.body.operatingHours) {
      operatingHours = JSON.parse(req.body.operatingHours);
      // console.log("Parsed operatingHours:", operatingHours);
    }
  
    delete req.body.operatingHours;
    
    const amenity = await Amenity.create({
      ...req.body,
      operatingHours,
      property: req.params.propertyId,
      images: imagePaths,
    });

    res.status(201).json({
      success: true,
      data: amenity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL AMENITIES
exports.getAllAmenities = async (req, res) => {
  try {

    const amenities = await Amenity.find().populate("property", "title description");

    res.json({
      success: true,
      count: amenities.length,
      data: amenities
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getAmenityById = async (req, res) => {
  try {
    const amenity = await Amenity.findById(req.params.id).populate(
      "property",
      "title description address",
    );

    if (!amenity) {
      return res.status(404).json({
        message: "Amenity not found",
      });
    }

    res.json({
      success: true,
      data: amenity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET AMENITIES BY PROPERTY
exports.getAmenitiesByProperty = async (req, res) => {
  try {

    const amenities = await Amenity.find({
      property: req.params.propertyId
    });

    res.json({
      success: true,
      count: amenities.length,
      data: amenities
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// get my amenity
exports.getMyAmenities = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // 1. Find owner’s properties
    const properties = await Property.find({ owner: ownerId }).select("_id");

    const propertyIds = properties.map((p) => p._id);

    // 2. Find amenities for those properties
    const amenities = await Amenity.find({
      property: { $in: propertyIds },
    }).populate("property", "title address");

    res.json({
      success: true,
      data: amenities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE AMENITY
exports.updateAmenity = async (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");
    const ownerId = req.user.id;

    //  1. GET OLD DATA FIRST
    const amenity = await Amenity.findById(req.params.id);

    if (!amenity) {
      return res.status(404).json({
        message: "Amenity not found",
      });
    }

    // 2. Check if this amenity belongs to owner's property
    const property = await Property.findOne({
      _id: amenity.property,
      owner: ownerId,
    });

    if (!property) {
      return res.status(403).json({
        message: "Not authorized to update this amenity",
      });
    }

    // 3. Parse incoming images
    const existingImages = JSON.parse(req.body.existingImages || "[]");

    const oldImages = amenity.images || [];

    //  4. Find deleted images
    const deletedImages = oldImages.filter(
      (img) => !existingImages.includes(img),
    );

    // console.log("OLD:", oldImages);
    // console.log("NEW:", existingImages);
    // console.log("DELETE:", deletedImages);

    //  5. Delete files from folder
    deletedImages.forEach((img) => {
      const filePath = path.join(__dirname, "..", img);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    if (req.body.operatingHours) {
      req.body.operatingHours = JSON.parse(req.body.operatingHours);
    }

    //  6. Update fields
    Object.keys(req.body).forEach((key) => {
      if (key !== "existingImages") {
        amenity[key] = req.body[key];
      }
    });

    // 7. Update images
    amenity.images = [
      ...existingImages,
      ...(req.files?.map((file) => file.path) || []),
    ];

    // 8. Save
    await amenity.save();

    res.json({
      success: true,
      data: amenity,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE AMENITY
exports.deleteAmenity = async (req, res) => {
  try {

    const amenity = await Amenity.findByIdAndDelete(req.params.id);

    if (!amenity) {
      return res.status(404).json({
        message: "Amenity not found"
      });
    }

    res.json({
      success: true,
      message: "Amenity deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
