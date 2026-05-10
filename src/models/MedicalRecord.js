const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },
    diagnosis: String,
    symptoms: [String],
    treatmentNotes: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);