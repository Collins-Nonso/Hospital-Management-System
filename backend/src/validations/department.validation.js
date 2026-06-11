// backend/src/validations/department.validation.js

const Joi = require("joi");

const createDepartmentValidation =
  Joi.object({
    name: Joi.string()
      .trim()
      .required(),

    description: Joi.string()
      .allow(""),

    status: Joi.string().valid(
      "active",
      "inactive"
    )
  });

module.exports = {
  createDepartmentValidation
};