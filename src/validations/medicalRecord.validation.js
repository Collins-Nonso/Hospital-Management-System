const Joi = require("joi");

const createMedicalRecordValidation =
  Joi.object({
    patient: Joi.string().required(),

    doctor: Joi.string().required(),

    consultation: Joi.string(),

    diagnosis: Joi.string().required(),

    treatmentNote: Joi.string()
      .required(),

    medicalHistory: Joi.array().items(
      Joi.string()
    )
  });

module.exports = {
  createMedicalRecordValidation
};