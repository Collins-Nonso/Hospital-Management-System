const labService = require("../services/lab.service");
const LabRequest = require("../models/LabRequest");
const LabResult = require("../models/LabResult");

exports.createLabRequest = async (req, res, next) => {
  try {
    const request = await labService.createLabRequest(req.body);

    res.status(201).json({
      success: true,
      message: "Lab request created",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLabRequests = async (req, res, next) => {
  try {
    const requests = await labService.getLabRequests();

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleLabRequest = async (req, res, next) => {
  try {
    const request = await labService.getSingleLabRequest(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Lab request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadLabResult = async (req, res, next) => {
  try {
    const result = await labService.uploadLabResult(req.body);

    res.status(201).json({
      success: true,
      message: "Lab result uploaded",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLabResults = async (req, res, next) => {
  try {
    const results = await labService.getLabResults();

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};