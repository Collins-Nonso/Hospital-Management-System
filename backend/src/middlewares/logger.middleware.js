// backend/src/middlewares/logger.middleware.js

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);

  next();
};

module.exports = loggerMiddleware;