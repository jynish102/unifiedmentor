exports.createStaff = async (req, res) => {
  try {
    const ownerId = req.user._id || req.user.id;

    const { fullname, email, phone, password, specialization } = req.body;

    // check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
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
