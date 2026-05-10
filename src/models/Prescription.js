const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient"
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor"
    },
    medicationName: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);