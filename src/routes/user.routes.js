const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const protect = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

router.post("/", protect, authorizeRoles("admin"), userController.createUser);
router.get("/", protect, authorizeRoles("admin"), userController.getUsers);
router.get("/:id", protect, userController.getSingleUser);
router.put("/:id", protect, userController.updateUser);
router.delete("/:id", protect, authorizeRoles("admin"), userController.deleteUser);

module.exports = router;
