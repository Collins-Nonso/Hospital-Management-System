const mongoose = require("mongoose");

const labRequestSchema = new mongoose.Schema(
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

    testName: String,

    instructions: String,

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("LabRequest", labRequestSchema);