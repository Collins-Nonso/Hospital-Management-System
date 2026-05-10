const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema(
  {
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription"
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient"
    },

    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    drugsDispensed: [String],

    dispensedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Pharmacy", pharmacySchema);