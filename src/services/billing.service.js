const Billing = require("../models/Billing");

const createBill = async (data) => {
  return await Billing.create(data);
};

const getBills = async () => {
  return await Billing.find()
    .populate("patient")
    .populate("appointment");
};

const payBill = async (id) => {
  return await Billing.findByIdAndUpdate(
    id,
    {
      paymentStatus: "paid"
    },
    {
      new: true
    }
  );
};

module.exports = {
  createBill,
  getBills,
  payBill
};