const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


const {
  createNotification,
  getMyNotifications,
  markAsRead,
  getUnreadNotificationCount
} = require("../controllers/notificationController");

router.post(
  "/create",
  authMiddleware,
 createNotification,
);


router.get("/", authMiddleware, getMyNotifications);
router.put("/:id/read", authMiddleware, markAsRead);
router.get("/unread-count", authMiddleware, getUnreadNotificationCount);


module.exports = router;
