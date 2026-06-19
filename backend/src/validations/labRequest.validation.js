// backend/src/validations/labRequest.validation.js

const Joi = require("joi");

const createLabRequestValidation = Joi.object({
  patient: Joi.string().required(),
  doctor: Joi.string().required(),
  consultation: Joi.string().optional(),   // was .required()
  testName: Joi.string().required(),
  instructions: Joi.string().allow("", null).optional(),
});

module.exports = {
  createLabRequestValidation
};