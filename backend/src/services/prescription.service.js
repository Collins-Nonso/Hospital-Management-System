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

module.exports = {
  createPrescription,
  getPrescriptions
};