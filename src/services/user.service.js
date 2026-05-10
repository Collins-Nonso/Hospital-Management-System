const User = require("../models/User");

const getUsers = async () => {
  return await User.find().select("-password");
};

const getSingleUser = async (id) => {
  return await User.findById(id).select("-password");
};

const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).select("-password");
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser
};