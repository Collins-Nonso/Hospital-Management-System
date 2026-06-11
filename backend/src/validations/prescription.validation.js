// backend/src/validations/prescription.validation.js

const Joi = require("joi");

const createPrescriptionValidation =
  Joi.object({
    patient: Joi.string().required(),

    doctor: Joi.string().required(),

    consultation: Joi.string(),

    medications: Joi.array()
      .items(
        Joi.object({
          medicationName:
            Joi.string().required(),

          dosage:
            Joi.string().required(),

          frequency:
            Joi.string().required(),

          duration:
            Joi.string().required(),

          instructions:
            Joi.string()
        })
      )
      .required()
  });

module.exports = {
  createPrescriptionValidation
};