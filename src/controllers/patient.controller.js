const Patient = require("../models/Patient");

exports.createPatient = async (req, res) => {
  const patient = await Patient.create(req.body);

  res.status(201).json({
    success: true,
    data: patient
  });
};

exports.getPatients = async (req, res) => {
  const patients = await Patient.find();

  res.status(200).json({
    success: true,
    data: patients
  });
};