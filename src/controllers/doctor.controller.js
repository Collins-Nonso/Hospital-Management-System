const Doctor = require("../models/Doctor");

exports.createDoctor = async (req, res) => {
  const doctor = await Doctor.create(req.body);

  res.status(201).json({
    success: true,
    data: doctor
  });
};

exports.getDoctors = async (req, res) => {
  const doctors = await Doctor.find().populate("department");

  res.status(200).json({
    success: true,
    data: doctors
  });
};