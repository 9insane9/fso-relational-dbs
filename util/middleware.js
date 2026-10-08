const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");
const { Sequelize, ValidationError } = require("sequelize");
const { Blog, User, Session } = require("../models");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "token missing" });
  }

  const token = authorization.substring(7);

  try {
    req.decodedToken = jwt.verify(token, SECRET);
    req.token = token;
  } catch (error) {
    return res.status(401).json({ error });
  }

  next();
};

const sessionValidator = async (req, res, next) => {
  const session = await Session.findOne({
    where: { token: req.token },
  });

  if (!session) {
    return res.status(401).json({ error: "invalid session" });
  }

  const user = await User.findByPk(req.decodedToken.id);

  if (user.disabled) {
    await Session.destroy({
      where: { userId: user.id },
    });

    return res.status(401).json({ error: "user is disabled" });
  }

  next();
};

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);

  if (!req.blog) {
    return res.status(404).json({ error: "Blog not found" });
  }
  next();
};

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

module.exports = { tokenExtractor, errorHandler, blogFinder, sessionValidator };
