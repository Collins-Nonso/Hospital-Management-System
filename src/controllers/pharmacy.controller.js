// src/controllers/pharmacy.controller.js

const pharmacyService = require("../services/pharmacy.service");
const PharmacyRecord = require("../models/Pharmacy");

exports.dispensePrescription = async (req, res, next) => {
  try {
    const record = await pharmacyService.dispensePrescription(req.body);

    res.status(201).json({
      success: true,
      message: "Prescription dispensed successfully",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPharmacyRecords = async (req, res, next) => {
  try {
    const records = await pharmacyService.getPharmacyRecords();

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSinglePharmacyRecord = async (req, res, next) => {
  try {
    const record = await pharmacyService.getSinglePharmacyRecord(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};
