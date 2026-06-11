// backend/src/routes/patient.routes.js

const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patient.controller");
const protect = require("../middlewares/auth.middleware");

router.post("/", protect, patientController.createPatient);
router.get("/", protect, patientController.getPatients);
router.get("/:id", protect, patientController.getSinglePatient);
router.put("/:id", protect, patientController.updatePatient);
router.delete("/:id", protect, patientController.deletePatient);

module.exports = router;
