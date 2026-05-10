const Prescription = require("../models/Prescription");

exports.createPrescription = async (req, res) => {
  const prescription = await Prescription.create(req.body);

  res.status(201).json({
    success: true,
    data: prescription
  });
};

exports.getPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find()
    .populate("patient")
    .populate("doctor");

  res.status(200).json({
    success: true,
    data: prescriptions
  });
};