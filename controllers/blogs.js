const router = require("express").Router();
const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);

  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

router.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    return res.json(blogs);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/api/blogs/:id", blogFinder, async (req, res) => {
  try {
    res.json(req.blog);
  } catch (error) {
    res.status(404).json({ error });
  }
});

router.post("/api/blogs", async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, date: new Date() });
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/api/blogs/:id", blogFinder, async (req, res) => {
  try {
    if (!req.blog) {
      res.status(404).json({ error: "Blog not found" });
    }
    await req.blog.destroy();
    res.status(204).end();
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
