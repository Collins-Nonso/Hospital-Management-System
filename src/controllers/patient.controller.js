const patientService = require("../services/patient.service");

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