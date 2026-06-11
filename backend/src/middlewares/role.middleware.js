// backend/src/middlewares/role.middleware.js

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
      console.error(`Unauthorized access attempt by user with role: ${req.user.role}`);
    }

    next();
  };
};

module.exports = authorizeRoles;