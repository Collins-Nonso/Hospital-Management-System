const userService = require("../services/user.service");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();

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
    const user = await userService.getSingleUser(req.params.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};