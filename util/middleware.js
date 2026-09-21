const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");
const { Sequelize, ValidationError } = require("sequelize");
const { Blog, User } = require("../models");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
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

module.exports = { tokenExtractor, errorHandler, blogFinder };
