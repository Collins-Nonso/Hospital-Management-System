// backend/src/services/auth.service.js

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const register = async (data) => {
  const existingUser = await User.findOne({
    email: data.email
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await User.create(data);

  return {
    user,
    token: generateToken(user)
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await user.comparePassword(password);

  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  return {
    user,
    token: generateToken(user)
  };
};

const getAllUsers = async () => {
  return await User.find().select("-password");
};

const getSingleUser = async (id) => {
  return await User.findById(id).select("-password");
};

const updateSingleUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).select("-password");
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  register,
  login,
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteUser
};