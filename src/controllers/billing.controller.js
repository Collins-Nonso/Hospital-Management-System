const billingService = require("../services/billing.service");

exports.createBill = async (req, res, next) => {
  try {
    const bill = await billingService.createBill(req.body);

    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      data: bill
    });
  } catch (error) {
    next(error);
  }
};

exports.getBills = async (req, res, next) => {
  try {
    const bills = await billingService.getBills();

    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleBill = async (req, res, next) => {
  try {
    const bill = await billingService.getSingleBill(req.params.id);

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
  } catch (error) {
    next(error);
  }
};

exports.markBillAsPaid = async (req, res, next) => {
  try {
    const bill = await billingService.markBillAsPaid(req.params.id);

    res.status(200).json({
      success: true,
      message: "Bill paid successfully",
      data: bill
    });
  } catch (error) {
    next(error);
  }
};