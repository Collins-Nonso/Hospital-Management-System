const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

exports.register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user
  });
});

exports.login = asyncHandler(async (req, res) => {
  const user = await authService.loginUser(
    req.body.email,
    req.body.password
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: user
  });
});