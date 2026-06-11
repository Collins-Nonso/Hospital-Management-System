// backend/src/models/LabResult.js

const mongoose = require("mongoose");

const labResultSchema = new mongoose.Schema(
  {
    labRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabRequest"
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient"
    },

    result: String,

    remarks: String,

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("LabResult", labResultSchema);