// backend/src/validations/labRequest.validation.js

const Joi = require("joi");

const createLabRequestValidation =
  Joi.object({
    patient: Joi.string().required(),

    doctor: Joi.string().required(),

    consultation: Joi.string()
      .required(),

    testName: Joi.string().required(),

    instructions: Joi.string()
  });

module.exports = {
  createLabRequestValidation
};