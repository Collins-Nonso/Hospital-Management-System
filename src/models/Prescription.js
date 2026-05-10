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

    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation"
    },

    medications: [
      {
        medicationName: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String
      }
    ],

    status: {
      type: String,
      enum: ["pending", "dispensed"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);