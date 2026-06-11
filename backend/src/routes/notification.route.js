// backend/src/routes/notification.route.js

const express = require("express");

const router = express.Router();

const notificationController = require("../controllers/notification.controller");

const protect = require("../middlewares/auth.middleware");

router.post("/", protect, notificationController.createNotification);
router.get("/", protect, notificationController.getNotifications);
router.patch("/:id", protect, notificationController.markRead);          // add
router.post("/read-all", protect, notificationController.markAllRead);   // add

module.exports = router;
