// backend/src/models/Consultation.js

const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment"
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient"
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor"
    },

    symptoms: [String],

    treatmentPlan: String,

    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Consultation", consultationSchema);