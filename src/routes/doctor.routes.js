const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
const protect = require("../middlewares/auth.middleware");

router.post("/", protect, doctorController.createDoctor);
router.get("/", protect, doctorController.getDoctors);

module.exports = router;