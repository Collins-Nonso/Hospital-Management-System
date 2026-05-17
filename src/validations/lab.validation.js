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

const uploadLabResultValidation =
  Joi.object({
    labRequest: Joi.string().required(),

    patient: Joi.string().required(),

    result: Joi.string().required(),

    remarks: Joi.string(),

    uploadedBy: Joi.string().required()
  });

module.exports = {
  createLabRequestValidation,
  uploadLabResultValidation
};