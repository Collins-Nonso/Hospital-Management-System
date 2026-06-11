// backend/src/routes/labResult.routes.js

const express = require("express");

const router = express.Router();

const labResultController = require("../controllers/labResult.controller");

const protect = require("../middlewares/auth.middleware");

router.post("/", protect, labResultController.createLabResult);
router.get("/", protect, labResultController.getLabResults);
router.get("/:id", protect, labResultController.getSingleLabResult);

module.exports = router;
