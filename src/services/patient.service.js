const Patient = require("../models/Patient");

const createPatient = async (data) => {
  return await Patient.create(data);
};

const getPatients = async () => {
  return await Patient.find();
};

const getSinglePatient = async (id) => {
  return await Patient.findById(id);
};

const updatePatient = async (id, data) => {
  return await Patient.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
};

const deletePatient = async (id) => {
  return await Patient.findByIdAndDelete(id);
};

module.exports = {
  createPatient,
  getPatients,
  getSinglePatient,
  updatePatient,
  deletePatient
};