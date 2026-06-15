// backend/src/services/prescription.service.js

const Prescription = require("../models/Prescription");

const createPrescription = async (data) => {
  return await Prescription.create(data);
};

const getPrescriptions = async () => {
  return await Prescription.find()
    .populate("patient")
    .populate("doctor");
};

const updatePrescription = async (id, data) => {
  return await Prescription.findByIdAndUpdate(id, data, { new: true });
};

const deletePrescription = async (id) => {
  return await Prescription.findByIdAndDelete(id);
};

module.exports = {
  createPrescription,
  getPrescriptions,
  updatePrescription,
  deletePrescription
};