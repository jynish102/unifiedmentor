const Notification = require("../models/Notifications");
const mongoose = require("mongoose");
const Use = require("../models/user");

/* ---------------------------------------------------
   CREATE NOTIFICATION
--------------------------------------------------- */
exports.createNotification = async (req, res) => {
  try {
    const { user, title, message, type } = req.body;

    const notification = await Notification.create({
      user,
      title,
      message,
      type,
      relatedId,
      relatedModel,
      redirectUrl,
    });

    res.status(201).json({
      success: true,
      message: "Notification created",
      data: notification,
    });
  } catch (error) {
    console.error("Create Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ---------------------------------------------------
   GET LOGGED-IN USER NOTIFICATIONS
--------------------------------------------------- */
exports.getMyNotifications = async (req, res) => {
  try {


    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    // console.log("REQ USER:", req.user.id);

    // const all = await Notification.find();

    // console.log(all);

    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error.res?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ---------------------------------------------------
   MARK SINGLE NOTIFICATION AS READ
--------------------------------------------------- */
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark Read Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ---------------------------------------------------
   MARK ALL AS READ
--------------------------------------------------- */
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark All Read Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET unread notification count
exports.getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ---------------------------------------------------
   DELETE NOTIFICATION
--------------------------------------------------- */
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
