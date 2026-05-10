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