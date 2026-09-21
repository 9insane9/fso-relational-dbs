const router = require("express").Router();
const { Blog, User } = require("../models");
const { tokenExtractor, blogFinder } = require("../util/middleware");
const { Op } = require("sequelize");

//getting all blogs
router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.substring]: req.query.search,
        },
      },
      {
        author: {
          [Op.substring]: req.query.search,
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    order: [["likes", "DESC"]],
    where,
  });

  return res.json(blogs);
});

//getting one
router.get("/:id", blogFinder, async (req, res) => {
  res.json(req.blog);
});

//creation
router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
    date: new Date(),
  });
  return res.status(201).json(blog);
});

//updating likes
router.put("/:id", blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes;
  await req.blog.save();
  res.json(req.blog);
});

//deletion
router.delete("/:id", tokenExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (req.blog.userId === user.id) {
    await req.blog.destroy();
    return res.status(204).end();
  }
  return res.status(403).end();
});

module.exports = router;
