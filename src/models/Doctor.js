const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    specialization: {
      type: String,
      required: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },
    availability: {
      type: Boolean,
      default: true
    },
    schedule: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);