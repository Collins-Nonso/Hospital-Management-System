const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    gender: String,

    dateOfBirth: Date,

    phone: String,

    address: String,

    bloodGroup: String,

    allergies: [String],

    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    },

    medicalHistory: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Patient", patientSchema);