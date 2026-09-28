const router = require("express").Router();
const { User, Blog, Session, ReadingList } = require("../models");

router.post("/", async (req, res) => {
  await ReadingList.destroy({
    where: {},
  });

  await Session.destroy({
    where: {},
  });

  await Blog.destroy({
    where: {},
  });

  await User.destroy({
    where: {},
  });

  return res.status(204).end();
});

module.exports = router;
