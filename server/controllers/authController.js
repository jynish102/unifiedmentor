const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, phone, role, password } = req.body;
    console.log(req.body)

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    

    await User.create({
      fullname,
      email,
      phone,
      role: role || "tenant",
      password,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} already exists`,
    });
  }

  res.status(500).json({ message: err.message });
}
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    // console.log("FILE:", req.file);
    // console.log("USER:", req.user);
    const userId = req.user.id; // from auth middleware

    const imagePath = req.file.path.replace(/\\/g, "/"); //  important

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: imagePath },
      { new: true },
    );

    res.json({
      message: "Profile image updated",
      profileImage: user.profileImage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
