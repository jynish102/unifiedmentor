const User = require("../models/User");

exports.createStaff = async (req, res) => {
  try {
     console.log("BODY:", req.body);
     console.log("USER:", req.user);
    const ownerId = req.user._id || req.user.id;

    const { fullname, email, phone, password, specialization } = req.body;

    // check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    const staff = await User.create({
      fullname,
      email,
      phone,
      password,
      role: "staff",
      owner: ownerId,
      specialization,
    });

    res.status(201).json({
      success: true,
      data: staff,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//my staff list
exports.getMyStaff = async (req, res) => {
  try {
    const ownerId = req.user._id || req.user.id;

    const staff = await User.find({
      role: "staff",
      owner: ownerId, // 
    }).select("-password");

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
