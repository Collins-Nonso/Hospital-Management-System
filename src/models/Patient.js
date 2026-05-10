const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    gender: String,
    age: Number,
    phone: String,
    address: String,
    allergies: [String],
    emergencyContact: {
      name: String,
      phone: String
    },
    medicalHistory: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Patient", patientSchema);