// backend/src/controllers/patient.controller.js

const patientService = require("../services/patient.service");
const Patient = require("../models/Patient");

exports.createPatient = async (req, res, next) => {
  try {
    const patient = await patientService.createPatient(req.body);

    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

exports.getPatients = async (req, res, next) => {
  try {
    const patients = await patientService.getPatients();

    res.status(200).json({
      success: true,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

exports.getSinglePatient = async (req, res, next) => {
  try {
    const patient = await patientService.getSinglePatient(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePatient = async (req, res, next) => {
  try {
    const patient = await patientService.updatePatient(req.params.id, req.body);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await patientService.deletePatient(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully"
    });
  }
    catch (error) {
    next(error);
  }
};