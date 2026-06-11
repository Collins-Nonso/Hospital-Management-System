// backend/src/controllers/prescription.controller.js

const Prescription = require("../models/Prescription");
const prescriptionService = require("../services/prescription.service");

exports.createPrescription = async (req, res, next) => {
  try {
    const prescription = await prescriptionService.createPrescription(req.body);

    res.status(201).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    next(error);
  }
};

exports.getPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await prescriptionService.getPrescriptions();

    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    next(error);
  }
};