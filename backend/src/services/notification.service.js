// backend/src/services/notification.service.js

const notification = require("../models/Notification");

const createNotification = async (data) => {
  const newNotification = new notification(data);
  return await newNotification.save();
};

const getNotifications = async () => {
  return await notification.find().populate("recipient").populate("sender").populate("relatedEntity");
};

const markRead = (id) => notification.findByIdAndUpdate(id, { read: true }, { new: true });

const markAllRead = (userId) => notification.updateMany({ recipient: userId }, { read: true });

module.exports = { createNotification, getNotifications, markRead, markAllRead };