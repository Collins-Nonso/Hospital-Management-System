const MedicalRecord = require("../models/MedicalRecord");

exports.createMedicalRecord = async (req, res) => {
  const record = await MedicalRecord.create(req.body);

  res.status(201).json({
    success: true,
    data: record
  });
};

exports.getMedicalRecords = async (req, res) => {
  const records = await MedicalRecord.find()
    .populate("patient")
    .populate("doctor");

  res.status(200).json({
    success: true,
    data: records
  });
};