// backend/src/routes/index.js

const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/users", require("./user.routes"));
router.use("/patients", require("./patient.routes"));
router.use("/consultations", require("./consultation.routes"));
router.use("/doctors", require("./doctor.routes"));
router.use("/departments", require("./department.routes"));
router.use("/appointments", require("./appointment.routes"));
router.use("/medical-records", require("./medicalRecord.routes"));
router.use("/lab-results", require("./labResult.routes"));
router.use("/lab-requests", require("./labRequest.routes"));
router.use("/pharmacies", require("./pharmacy.routes"));
router.use("/prescriptions", require("./prescription.routes"));
router.use("/billings", require("./billing.routes"));
router.use("/notifications", require("./notification.routes"));

module.exports = router;
