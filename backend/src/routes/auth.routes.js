// backend/src/routes/auth.routes.js

const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/all", authController.getAllUsers);
router.get("/:id", authController.getSingleUser);
router.put("/:id", authController.updateSingleUser);
router.delete("/:id", authController.deleteUser);

module.exports = router;
