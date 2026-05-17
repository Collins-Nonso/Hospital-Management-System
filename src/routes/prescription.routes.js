const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescription.controller");
const protect = require("../middlewares/auth.middleware");

router.post("/", protect, prescriptionController.createPrescription);
router.get("/", protect, prescriptionController.getPrescriptions);

module.exports = router;
