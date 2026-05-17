const MedicalRecord = require("../models/MedicalRecord");
const medicalRecordService = require("../services/medicalRecord.service");

exports.createMedicalRecord = async (req, res, next) => {
  try {
    const record = await medicalRecordService.createMedicalRecord(req.body);

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

exports.getMedicalRecords = async (req, res, next) => {
  try {
    const records = await medicalRecordService.getMedicalRecords();

    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleMedicalRecord = async (req, res, next) => {
  try {
    const record = await medicalRecordService.getSingleMedicalRecord(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found"
      });
    }
    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMedicalRecord = async (req, res, next) => {
  try {
    const record = await medicalRecordService.updateMedicalRecord(req.params.id, req.body);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found"
      });
    }
    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMedicalRecord = async (req, res, next) => {
  try {
    const record = await medicalRecordService.deleteMedicalRecord(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found"
      });
    }
    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};
