const Amenity = require("../models/Amenity");

exports.createAmenity = async (req, res) => {
  try {
     console.log("BODY:", req.body);
     console.log("FILES:", req.files);

     if (!req.body) {
       return res.status(400).json({ message: "No data received" });
     }
    const imagePaths = req.files?.map((file) => file.path) || [];

    let operatingHours = {};
    // fix object field
    if (req.body.operatingHours) {
      req.body.operatingHours = JSON.parse(req.body.operatingHours);
    }

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

// UPDATE AMENITY
exports.updateAmenity = async (req, res) => {
  try {

    const amenity = await Amenity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!amenity) {
      return res.status(404).json({
        message: "Amenity not found"
      });
    }

    res.json({
      success: true,
      data: amenity
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
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
