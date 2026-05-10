const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/users", require("./user.routes"));
router.use("/patients", require("./patient.routes"));
router.use("/doctors", require("./doctor.routes"));
router.use("/departments", require("./department.routes"));
router.use("/appointments", require("./appointment.routes"));
router.use("/medical-records", require("./medicalRecord.routes"));
router.use("/prescriptions", require("./prescription.routes"));
router.use("/billings", require("./billing.routes"));

module.exports = router;