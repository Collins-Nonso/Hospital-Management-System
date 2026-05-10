const Joi = require("joi");

const createPatientValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  gender: Joi.string().required(),
  phone: Joi.string().required()
});

module.exports = {
  createPatientValidation
};