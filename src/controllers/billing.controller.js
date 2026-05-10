const Billing = require("../models/Billing");

exports.createBill = async (req, res) => {
  const bill = await Billing.create(req.body);

  res.status(201).json({
    success: true,
    data: bill
  });
};

exports.getBills = async (req, res) => {
  const bills = await Billing.find()
    .populate("patient")
    .populate("appointment");

  res.status(200).json({
    success: true,
    data: bills
  });
};

exports.payBill = async (req, res) => {
  const bill = await Billing.findByIdAndUpdate(
    req.params.id,
    {
      paymentStatus: "paid"
    },
    {
      new: true
    }
  );

  res.status(200).json({
    success: true,
    data: bill
  });
};

exports.getBillById = async (req, res) => {
  const bill = await Billing.findById(req.params.id)
    .populate("patient")
    .populate("appointment");

    if (!bill) {
        return res.status(404).json({
            success: false,
            message: "Bill not found"
        });
    }

    res.status(200).json({
        success: true,
        data: bill
    });
};

exports.deleteBill = async (req, res) => {
  const bill = await Billing.findByIdAndDelete(req.params.id);

    if (!bill) {
        return res.status(404).json({
            success: false,
            message: "Bill not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Bill deleted successfully"
    });
};