// backend/src/models/Notification.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, enum: ["info", "success", "warning", "error"], required: true },
        read: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);