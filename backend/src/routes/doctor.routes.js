// backend/src/routes/doctor.routes.js

const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
const protect = require("../middlewares/auth.middleware");

router.post("/", protect, doctorController.createDoctor);
router.get("/", protect, doctorController.getDoctors);
router.put("/:id", protect, doctorController.updateDoctor);
router.delete("/:id", protect, doctorController.deleteDoctor);

module.exports = router;
