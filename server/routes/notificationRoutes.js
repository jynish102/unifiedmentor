const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


const {
  createNotification,
  getMyNotifications,
} = require("../controllers/notificationController");

router.post(
  "/create",
  authMiddleware,
 createNotification,
);


router.get("/", authMiddleware, getMyNotifications);


module.exports = router;
