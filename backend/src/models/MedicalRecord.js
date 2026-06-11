// backend/src/models/MedicalRecord.js

const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
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

    diagnosis: String,

    treatmentNote: String,

    medicalHistory: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);