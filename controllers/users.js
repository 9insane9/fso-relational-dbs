const router = require("express").Router();
const tokenExtractor = require("../util/tokenExtractor");
const { User, Blog } = require("../models");
const bcrypt = require("bcrypt");

//get all
router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ["userId", "passwordHash"],
      },
    },
  });
  res.json(users);
});

//get one
router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: {
      exclude: ["passwordHash"],
    },
  });

  res.json(user);
});

//create new
router.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = User.build({ username, name, passwordHash });
  await user.save();

  res.json({
    username: user.username,
    name: user.name,
  });
});

//name update
router.put("/:username", tokenExtractor, async (req, res) => {
  const user = await User.findOne({
    where: { username: req.params.username },
  });

  if (user.id !== req.decodedToken.id) {
    return res.status(403).end();
  }

  user.name = req.body.name;
  await user.save();

  res.json(user);
});

module.exports = router;
