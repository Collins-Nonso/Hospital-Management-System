// backend/src/controllers/doctor.controller.js

const Doctor = require("../models/Doctor");
const doctorService = require("../services/doctor.service");

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

exports.updateDoctor = async (req, res) => {
  // Destructure and whitelist only the fields you want to allow
  const { availability } = req.body;
  
  const updatePayload = {
    ...(availability !== undefined && { availability })
  };

  const doctor = await doctorService.updateDoctor(req.params.id, { $set: updatePayload });

  res.status(200).json({
    success: true,
    data: doctor
  });
};


exports.deleteDoctor = async (req, res) => {
  await doctorService.deleteDoctor(req.params.id);

  res.status(204).json({
    success: true,
    data: null
  });
};