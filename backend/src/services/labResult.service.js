// backend/src/services/labResult.service.js

const LabResult = require("../models/LabResult");

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

  return result;
};

const getLabResults = async () => {
  return await LabResult.find()
    .populate("patient")
    .populate("labRequest")
    .populate("uploadedBy");
};

const getSingleLabResult = async (
  id
) => {
  return await LabResult.findById(id)
    .populate("patient")
    .populate("labRequest")
    .populate("uploadedBy");
};


module.exports = {
  uploadLabResult,
  getLabResults,
  getSingleLabResult
};