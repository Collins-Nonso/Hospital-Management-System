const express = require("express");

const router = express.Router();

const labController = require("../controllers/lab.controller");

const protect = require("../middlewares/auth.middleware");

router.post("/requests", protect, labController.createLabRequest);
router.get("/requests", protect, labController.getLabRequests);
router.get("/requests/:id", protect, labController.getSingleLabRequest);
router.post("/results", protect, labController.uploadLabResult);
router.get("/results", protect, labController.getLabResults);

module.exports = router;
