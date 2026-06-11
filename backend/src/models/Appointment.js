// backend/src/models/Appointment.js

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["booked", "confirmed", "cancelled", "completed"],
      default: "booked",
    },

    reason: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Appointment", appointmentSchema);