// backend/src/controllers/appointment.controller.js

const Appointment = require("../models/Appointment");
const appointmentService = require("../services/appointment.service");

exports.bookAppointment = async (req, res) => {
  const appointment = await appointmentService.bookAppointment(req.body);

  res.status(201).json({
    success: true,
    data: appointment
  });
};

exports.getAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate("patient")
    .populate("doctor");

  res.status(200).json({
    success: true,
    data: appointments
  });
};

exports.cancelAppointment = async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: "cancelled" },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: appointment
  });
};