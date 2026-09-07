const router = require("express").Router();
const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);

  if (!req.blog) {
    return res.status(404).json({ error: "Blog not found" });
  }
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  return res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
  res.json(req.blog);
});

//creation
router.post("/", async (req, res) => {
  const blog = await Blog.create({ ...req.body, date: new Date() });
  return res.status(201).json(blog);
});

//updating likes
router.put("/:id", blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes;
  await req.blog.save();
  res.json(req.blog);
});

router.delete("/:id", blogFinder, async (req, res) => {
  await req.blog.destroy();
  res.status(204).end();
});

module.exports = router;
