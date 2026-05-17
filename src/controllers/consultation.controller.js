const consultationService = require("../services/consultation.service");
const Consultation = require("../models/Consultation");

exports.createConsultation = async (req, res, next) => {
  try {
    const consultation = await consultationService.createConsultation(req.body);

    res.status(201).json({
      success: true,
      message: "Consultation created successfully",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

exports.getConsultations = async (req, res, next) => {
  try {
    const consultations = await consultationService.getConsultations();

    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleConsultation = async (req, res, next) => {
  try {
    const consultation = await consultationService.getSingleConsultation(
      req.params.id,
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateConsultation = async (req, res, next) => {
  try {
    const consultation = await consultationService.updateConsultation(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Consultation updated successfully",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

exports.completeConsultation = async (req, res, next) => {
  try {
    const consultation = await consultationService.completeConsultation(
      req.params.id,
    );

    res.status(200).json({
      success: true,
      message: "Consultation completed",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};