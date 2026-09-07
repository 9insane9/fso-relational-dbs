const { Sequelize, ValidationError } = require("sequelize");

const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  console.log(err.name);

  if (err instanceof Sequelize.DatabaseError || ValidationError) {
    return res.status(400).json({ error: err.message });
  }

  return next(err);
};

module.exports = errorHandler;
