const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
const protect = require("../middlewares/auth.middleware");

router.post("/", protect, appointmentController.bookAppointment);
router.get("/", protect, appointmentController.getAppointments);
router.patch(
  "/:id/cancel",
  protect,
  appointmentController.cancelAppointment
);

module.exports = router;