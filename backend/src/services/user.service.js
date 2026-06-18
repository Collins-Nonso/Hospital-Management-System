// backend/src/services/user.service.js

const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createUser = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error("User with this email already exists");
  const hashed = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hashed });
  const out = user.toObject();
  delete out.password;
  return out;
};

const getUsers = async () => User.find().select("-password");

const getSingleUser = async (id) => User.findById(id).select("-password");

const updateSingleUser = async (id, data) => {
  const patch = { ...data };
  if (patch.password) patch.password = await bcrypt.hash(patch.password, 10);
  else delete patch.password;
  return User.findByIdAndUpdate(id, patch, { new: true, runValidators: true }).select("-password");
};

const deleteUser = async (id) => User.findByIdAndDelete(id);

module.exports = { createUser, getUsers, getSingleUser, updateSingleUser, deleteUser };