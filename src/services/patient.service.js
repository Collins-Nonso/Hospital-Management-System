const Patient = require("../models/Patient");

const createPatient = async (data) => {
  return await Patient.create(data);
};

const getPatients = async () => {
  return await Patient.find();
};

module.exports = {
  createPatient,
  getPatients
};