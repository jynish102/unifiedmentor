const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


const {
  createNotification,
  getMyNotifications,
  markAsRead,
} = require("../controllers/notificationController");

router.post(
  "/create",
  authMiddleware,
 createNotification,
);


router.get("/", authMiddleware, getMyNotifications);
router.put("/:id/read", authMiddleware, markAsRead);


module.exports = router;
