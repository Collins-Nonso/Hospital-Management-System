// backend/src/routes/labRequest.route.js

const express = require("express");

const router = express.Router();

const labRequestController = require("../controllers/labRequest.controller");

const protect = require("../middlewares/auth.middleware");

router.post("/", protect, labRequestController.createLabRequest);
router.get("/", protect, labRequestController.getLabRequests);
router.get("/:id", protect, labRequestController.getSingleLabRequest);

module.exports = router;
