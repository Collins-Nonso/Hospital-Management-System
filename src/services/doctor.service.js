const Doctor = require("../models/Doctor");

const createDoctor = async (data) => {
  return await Doctor.create(data);
};

const getDoctors = async () => {
  return await Doctor.find().populate("department");
};

module.exports = {
  createDoctor,
  getDoctors
};