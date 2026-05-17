const Joi = require("joi");

const createConsultationValidation =
  Joi.object({
    appointment: Joi.string().required(),

    patient: Joi.string().required(),

    doctor: Joi.string().required(),

    symptoms: Joi.array().items(
      Joi.string()
    ),

    diagnosis: Joi.string().required(),

    treatmentPlan: Joi.string().required()
  });

module.exports = {
  createConsultationValidation
};