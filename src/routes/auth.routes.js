const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/all", authController.getAllUsers);
router.get("/:id", authController.getUserProfile);
router.put("/:id", authController.updateUserProfile);
router.delete("/:id", authController.deleteUser);

module.exports = router;
