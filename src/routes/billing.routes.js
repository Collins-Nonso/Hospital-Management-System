const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billing.controller");
const protect = require("../middlewares/auth.middleware");

router.post("/", protect, billingController.createBill);
router.get("/", protect, billingController.getBills);
router.patch("/:id/pay", protect, billingController.payBill);

module.exports = router;