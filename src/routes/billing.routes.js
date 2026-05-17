const express = require("express");

const router = express.Router();

const billingController = require("../controllers/billing.controller");

const protect = require("../middlewares/auth.middleware");

router.post("/", protect, billingController.createBill);
router.get("/", protect, billingController.getBills);
router.get("/:id", protect, billingController.getSingleBill);
router.patch("/:id/pay", protect, billingController.markBillAsPaid);

module.exports = router;
