const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/department.controller");
const protect = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  departmentController.createDepartment
);

router.get(
  "/",
  protect,
  departmentController.getDepartments
);

router.get(
  "/:id",
  protect,
  departmentController.getDepartmentById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  departmentController.updateDepartment
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  departmentController.deleteDepartment
);

module.exports = router;