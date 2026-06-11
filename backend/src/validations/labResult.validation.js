// backend/src/validations/labResult.validation.js

const Joi = require("joi");

const uploadLabResultValidation =
  Joi.object({
    labResult: Joi.string().required(),

    patient: Joi.string().required(),

    result: Joi.string().required(),

    remarks: Joi.string(),

    uploadedBy: Joi.string().required()
  });

module.exports = {
  uploadLabResultValidation
};