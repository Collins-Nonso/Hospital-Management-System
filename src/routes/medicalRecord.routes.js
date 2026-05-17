const express = require("express");
const router = express.Router();
const medicalRecordController = require("../controllers/medicalRecord.controller");
const protect = require("../middlewares/auth.middleware");

router.post("/", protect, medicalRecordController.createMedicalRecord);
router.get("/", protect, medicalRecordController.getMedicalRecords);

module.exports = router;
