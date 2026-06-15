// backend/src/services/doctor.service.js

const Doctor = require("../models/Doctor");

const createDoctor = async (data) => {
  return await Doctor.create(data);
};

const getDoctors = async () => {
  return await Doctor.find().populate("department");
};

const updateDoctor = async (id, data) => {
  return await Doctor.findByIdAndUpdate(id, data, { new: true });
};

const deleteDoctor = async (id) => {
  await Doctor.findByIdAndDelete(id);
};

module.exports = {
  createDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor
};