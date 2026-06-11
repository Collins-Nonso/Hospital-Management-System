// backend/src/validations/appointment.validation.js

const Joi = require("joi");

const createAppointmentValidation =
  Joi.object({
    patient: Joi.string().required(),

    doctor: Joi.string().required(),

    appointmentDate: Joi.date()
      .required(),

    reason: Joi.string().required()
  });

module.exports = {
  createAppointmentValidation
};