// backend/src/routes/prescription.routes.js

const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescription.controller");
const protect = require("../middlewares/auth.middleware");

router.post("/", protect, prescriptionController.createPrescription);
router.get("/", protect, prescriptionController.getPrescriptions);
router.patch("/:id", protect, prescriptionController.updatePrescription);
router.delete("/:id", protect, prescriptionController.deletePrescription);

module.exports = router;
