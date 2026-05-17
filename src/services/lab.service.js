const LabRequest = require("../models/LabRequest");
const LabResult = require("../models/LabResult");

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

const uploadLabResult = async (data) => {
  const existingResult =
    await LabResult.findOne({
      labRequest: data.labRequest
    });

  if (existingResult) {
    throw new Error(
      "Lab result already uploaded"
    );
  }

  const result = await LabResult.create(data);

  await LabRequest.findByIdAndUpdate(
    data.labRequest,
    {
      status: "completed"
    }
  );

  return result;
};

const getLabResults = async () => {
  return await LabResult.find()
    .populate("patient")
    .populate("labRequest")
    .populate("uploadedBy");
};

module.exports = {
  createLabRequest,
  getLabRequests,
  getSingleLabRequest,
  uploadLabResult,
  getLabResults
};