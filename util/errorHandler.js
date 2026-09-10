const { Sequelize, ValidationError } = require("sequelize");

const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  console.log(err.name);
  console.log(err.response?.data);

  if (
    err instanceof Sequelize.DatabaseError ||
    err instanceof ValidationError
  ) {
    return res.status(400).json({ error: err.message });
  }

  return next(err);
};

module.exports = errorHandler;
