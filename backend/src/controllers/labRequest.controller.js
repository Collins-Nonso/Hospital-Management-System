// backend/src/controllers/labRequest.controller.js

const labRequestService = require("../services/labRequest.service");
const LabRequest = require("../models/LabRequest");

exports.createLabRequest = async (req, res, next) => {
  try {
    const request = await labRequestService.createLabRequest(req.body);

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
    const requests = await labRequestService.getLabRequests();

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
    const request = await labRequestService.getSingleLabRequest(req.params.id);

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