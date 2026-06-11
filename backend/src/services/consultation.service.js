// backend/src/services/consultation.service.js

const Consultation = require("../models/Consultation");

const createConsultation = async (data) => {
  return await Consultation.create(data);
};

const getConsultations = async () => {
  return await Consultation.find()
    .populate("patient")
    .populate("doctor")
    .populate("appointment");
};

const getSingleConsultation = async (id) => {
  return await Consultation.findById(id)
    .populate("patient")
    .populate("doctor")
    .populate("appointment");
};

const updateConsultation = async (
  id,
  data
) => {
  return await Consultation.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true
    }
  );
};

const completeConsultation = async (id) => {
  return await Consultation.findByIdAndUpdate(
    id,
    {
      status: "completed"
    },
    {
      new: true
    }
  );
};

module.exports = {
  createConsultation,
  getConsultations,
  getSingleConsultation,
  updateConsultation,
  completeConsultation
};