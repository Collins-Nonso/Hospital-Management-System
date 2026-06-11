// backend/src/controllers/labResult.controller.js

const labResultService = require("../services/labResult.service");
const LabResult = require("../models/LabResult");

exports.createLabResult = async (req, res, next) => {
  try {
    const result = await labResultService.createLabResult(req.body);

    res.status(201).json({
      success: true,
      message: "Lab result created",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLabResults = async (req, res, next) => {
  try {
    const results = await labResultService.getLabResults();

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleLabResult = async (req, res, next) => {
  try {
    const result = await labResultService.getSingleLabResult(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Lab result not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadLabResult = async (req, res, next) => {
  try {
    const result = await labResultService.uploadLabResult(req.body);

    res.status(201).json({
      success: true,
      message: "Lab result uploaded",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};