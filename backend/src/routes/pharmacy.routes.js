// backend/src/routes/pharmacy.routes.js

const express = require("express");

const router = express.Router();

const pharmacyController = require("../controllers/pharmacy.controller");

const protect = require("../middlewares/auth.middleware");

router.post("/dispense", protect, pharmacyController.dispensePrescription);
router.get("/", protect, pharmacyController.getPharmacyRecords);
router.get("/:id", protect, pharmacyController.getSinglePharmacyRecord);

module.exports = router;
