// src/services/department.service.js

const Department = require("../models/Department");

const createDepartment = async (data) => {
  // Check duplicate department
  const existingDepartment = await Department.findOne({
    name: data.name,
  });

  if (existingDepartment) {
    throw new Error("Department already exists");
  }

  // Save department
  const department = await Department.create({
    name: data.name,
    description: data.description,
    status: data.status,
  });

  return department;
};

const getDepartments = async () => {
  return await Department.find();
};

const getSingleDepartment = async (id) => {
  return await Department.findById(id);
};

const updateDepartment = async (id, data) => {
  return await Department.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteDepartment = async (id) => {
  return await Department.findByIdAndDelete(id);
};

module.exports = {
  createDepartment,
  getDepartments,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
};