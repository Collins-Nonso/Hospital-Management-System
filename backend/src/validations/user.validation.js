// backend/src/validations/user.validation.js

const Joi = require("joi");

const updateUserValidation = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  phone: Joi.string(),
  role: Joi.string(),
  status: Joi.string()
});

module.exports = {
  updateUserValidation
};