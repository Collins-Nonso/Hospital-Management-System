const Joi = require("joi");

const createDoctorValidation =
  Joi.object({
    firstName: Joi.string().required(),

    lastName: Joi.string().required(),

    department: Joi.string().required(),

    specialization: Joi.string()
      .required(),

    phone: Joi.string(),

    availability: Joi.boolean(),

    status: Joi.string().valid(
      "active",
      "inactive"
    )
  });

module.exports = {
  createDoctorValidation
};