// backend/src/services/pharmacy.service.js

const Pharmacy = require("../models/Pharmacy");
const Prescription = require("../models/Prescription");

const dispensePrescription = async (data) => {
  const prescription =
    await Prescription.findById(
      data.prescription
    );

  if (!prescription) {
    throw new Error("Prescription not found");
  }

  if (prescription.status === "dispensed") {
    throw new Error(
      "Prescription already dispensed"
    );
  }

  const pharmacyRecord =
    await Pharmacy.create(data);

  prescription.status = "dispensed";

  await prescription.save();

  return pharmacyRecord;
};

const getPharmacyRecords = async () => {
  return await Pharmacy.find()
    .populate("patient")
    .populate("prescription")
    .populate("pharmacist");
};

const getSinglePharmacyRecord = async (
  id
) => {
  return await Pharmacy.findById(id)
    .populate("patient")
    .populate("prescription")
    .populate("pharmacist");
};

module.exports = {
  dispensePrescription,
  getPharmacyRecords,
  getSinglePharmacyRecord
};