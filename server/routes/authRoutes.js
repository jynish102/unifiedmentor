const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadPropertyImages")
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  updateProfileImage,
  changePassword,
  deactivateAccount,
  reactivateUser,
} = require("../controllers/authController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile-image", upload.single("image"), authMiddleware, updateProfileImage);
router.put("/change-password", authMiddleware, changePassword);
router.put("/deactivate-account", authMiddleware, deactivateAccount);
router.put("/reactivate",  reactivateUser);


module.exports = router;
