const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadPropertyImages")
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  updateProfileImage,
  changePassword,
} = require("../controllers/authController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile-image", upload.single("image"), authMiddleware, updateProfileImage);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
