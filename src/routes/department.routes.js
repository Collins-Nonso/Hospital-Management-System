// src/routes/department.routes.js

const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/department.controller");

const validate = require("../middlewares/validate.middleware");

const {
  createDepartmentValidation,
} = require("../validations/department.validation");

router.post("/", validate(createDepartmentValidation), departmentController.createDepartment);
router.get("/", departmentController.getDepartments);
router.get("/:id", departmentController.getSingleDepartment);
router.put("/:id", departmentController.updateDepartment);
router.delete("/:id", departmentController.deleteDepartment);

module.exports = router;
