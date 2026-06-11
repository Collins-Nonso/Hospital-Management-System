// backend/src/controllers/notification.controller.js

const notificationService = require("../services/notification.service");
const notification = require("../models/Notification");

exports.createNotification = async (req, res, next) => {
    try {
        const newNotification = await notificationService.createNotification(req.body);

        res.status(201).json({
            success: true,
            message: "Notification created",
            data: newNotification,
        });
    } catch (error) {
        next(error);
    }
};

exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.getNotifications();
        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

exports.markRead = async (req, res, next) => {
  try { res.json({ success: true, data: await notificationService.markRead(req.params.id) }); }
  catch (e) { next(e); }
};

exports.markAllRead = async (req, res, next) => {
  try { await notificationService.markAllRead(req.user.id); res.json({ success: true }); }
  catch (e) { next(e); }
};