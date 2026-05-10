const MedicalRecord = require("../models/MedicalRecord");

const createMedicalRecord = async (data) => {
  return await MedicalRecord.create(data);
};

const getMedicalRecords = async () => {
  return await MedicalRecord.find()
    .populate("patient")
    .populate("doctor");
};

module.exports = {
  createMedicalRecord,
  getMedicalRecords
};