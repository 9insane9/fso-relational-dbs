const router = require("express").Router();
const { tokenExtractor, sessionValidator } = require("../util/middleware");
const { ReadingList, User } = require("../models");

//new entry
router.post("/", async (req, res) => {
  const newEntry = ReadingList.build({ ...req.body });
  await newEntry.save();

  res.json(newEntry);
});

//update read status
router.put("/:id", tokenExtractor, sessionValidator, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);

  if (req.decodedToken.id === user.id) {
    const entry = await ReadingList.findByPk(req.params.id);
    entry.read = req.body.read;
    await entry.save();

    return res.status(200).end();
  }
  return res.status(403).end();
});

module.exports = router;
