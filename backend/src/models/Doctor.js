// backend/src/models/Doctor.js

const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    firstName: String,

    lastName: String,

    email: String,

    phone: String,

    specialization: String,

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },

    availability: {
      type: Boolean,
      default: true
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);