// backend/src/controllers/auth.controller.js

const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const data = await authService.login(
      req.body.email,
      req.body.password
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);

    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleUser = async (req, res, next) => {
  try {
    const user = await authService.getSingleUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSingleUser = async (req, res, next) => {
  try {
    const user = await authService.updateSingleUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    } res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await authService.deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({

      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};