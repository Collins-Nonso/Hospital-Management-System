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

module.exports = {
  register,
  login
};