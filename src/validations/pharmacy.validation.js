const Joi = require("joi");

const dispensePrescriptionValidation =
  Joi.object({
    prescription: Joi.string()
      .required(),

    patient: Joi.string().required(),

    pharmacist: Joi.string()
      .required(),

    drugsDispensed: Joi.array()
      .items(Joi.string())
      .required()
  });

module.exports = {
  dispensePrescriptionValidation
};