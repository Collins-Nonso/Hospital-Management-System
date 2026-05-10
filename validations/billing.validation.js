const Joi = require("joi");

const createBillValidation = Joi.object({
  patient: Joi.string().required(),

  appointment: Joi.string().optional(),

  consultant: Joi.string().optional(),

  paymentMethod: Joi.string()
    .valid("cash", "card", "transfer", "insurance")
    .required(),

  notes: Joi.string().optional(),

  billItems: Joi.array()
    .items(
      Joi.object({
        itemName: Joi.string().required(),

        quantity: Joi.number()
          .min(1)
          .required(),

        unitPrice: Joi.number()
          .min(0)
          .required()
      })
    )
    .min(1)
    .required()
});

module.exports = {
  createBillValidation
};