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
  const allowed = [
    "firstName", "lastName", "email", "phone",
    "specialization", "department", "availability", "status",
  ];
  const updatePayload = {};
  for (const k of allowed) {
    if (req.body[k] !== undefined) updatePayload[k] = req.body[k];
  }
  const doctor = await doctorService.updateDoctor(req.params.id, { $set: updatePayload });
  res.status(200).json({ success: true, data: doctor });
};


exports.deleteDoctor = async (req, res) => {
  await doctorService.deleteDoctor(req.params.id);

  res.status(204).json({
    success: true,
    data: null
  });
};