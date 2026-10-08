const router = require("express").Router();
const { tokenExtractor, sessionValidator } = require("../util/middleware");
const { ReadingList, User, Blog } = require("../models");

//new entry
router.post("/", async (req, res) => {
  const { blogId, userId } = req.body;
  //check for missing fields

  if (!blogId || !userId) {
    return res.status(400).end();
  }

  // check if user and blog both exist

  const user = await User.findByPk(userId);
  const blog = await Blog.findByPk(blogId);

  if (!user || !blog) {
    return res.status(404).end();
  }

  // check for duplicate entry
  const alreadyExisting = await ReadingList.findOne({
    where: { blogId: blogId, userId: userId },
  });

  if (alreadyExisting) {
    return res.status(400).end();
  }

  const newEntry = ReadingList.build({ blogId, userId });
  await newEntry.save();

  return res.json(newEntry);
});

//update read status
router.put("/:id", tokenExtractor, sessionValidator, async (req, res) => {
  const entry = await ReadingList.findByPk(req.params.id);

  //exists at all?
  if (!entry) {
    return res.status(404).end();
  }

  // authorized?
  if (entry.userId !== req.decodedToken.id) {
    return res.status(401).end();
  }

  entry.read = req.body.read;
  await entry.save();

  return res.status(200).json(entry);
});

module.exports = router;
