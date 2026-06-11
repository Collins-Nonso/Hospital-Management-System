// backend/src/services/labRequest.service.js

const LabRequest = require("../models/LabRequest");

const createLabRequest = async (data) => {
  return await LabRequest.create(data);
};

const getLabRequests = async () => {
  return await LabRequest.find()
    .populate("patient")
    .populate("doctor")
    .populate("consultation");
};

const getSingleLabRequest = async (
  id
) => {
  return await LabRequest.findById(id)
    .populate("patient")
    .populate("doctor")
    .populate("consultation");
};


module.exports = {
  createLabRequest,
  getLabRequests,
  getSingleLabRequest
};