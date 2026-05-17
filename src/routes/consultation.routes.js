const express = require("express");

const router = express.Router();

const consultationController = require("../controllers/consultation.controller");

const protect = require("../middlewares/auth.middleware");

router.post("/", protect, consultationController.createConsultation);
router.get("/", protect, consultationController.getConsultations);
router.get("/:id", protect, consultationController.getSingleConsultation);
router.put("/:id", protect, consultationController.updateConsultation);
router.patch("/:id/complete", protect, consultationController.completeConsultation);

module.exports = router;
