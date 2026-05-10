const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const protect = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  userController.getUsers
);

router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  userController.getSingleUser
);

module.exports = router;