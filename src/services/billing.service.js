const Billing = require("../models/Billing");
const generateId = require("../utils/generateId");

const calculateTotalAmount = (billItems) => {
  return billItems.reduce((acc, item) => {
    return acc + item.totalPrice;
  }, 0);
};

const createBill = async (data) => {
  const processedItems = data.billItems.map((item) => ({
    ...item,
    totalPrice: item.quantity * item.unitPrice
  }));

  const totalAmount = calculateTotalAmount(processedItems);

  const bill = await Billing.create({
    invoiceNumber: generateId("INV"),
    patient: data.patient,
    appointment: data.appointment,
    consultant: data.consultant,
    billItems: processedItems,
    totalAmount,
    paymentMethod: data.paymentMethod,
    notes: data.notes
  });

  return bill;
};

const getBills = async () => {
  return await Billing.find()
    .populate("patient")
    .populate("appointment")
    .populate("consultant");
};

const getSingleBill = async (id) => {
  return await Billing.findById(id)
    .populate("patient")
    .populate("appointment")
    .populate("consultant");
};

const markBillAsPaid = async (id) => {
  const bill = await Billing.findById(id);

  if (!bill) {
    throw new Error("Bill not found");
  }

  if (bill.paymentStatus === "paid") {
    throw new Error("Bill has already been paid");
  }

  bill.paymentStatus = "paid";
  bill.paidAt = new Date();

  await bill.save();

  return bill;
};

module.exports = {
  createBill,
  getBills,
  getSingleBill,
  markBillAsPaid,
  calculateTotalAmount
};