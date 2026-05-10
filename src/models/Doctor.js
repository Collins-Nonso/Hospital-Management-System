const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },

    specialization: String,

    phone: String,

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