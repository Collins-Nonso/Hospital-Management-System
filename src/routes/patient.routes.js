const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient.controller");
const protect = require("../middlewares/auth.middleware");

router.post("/", protect, patientController.createPatient);
router.get("/", protect, patientController.getPatients);

module.exports = router;