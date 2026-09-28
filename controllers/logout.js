const { tokenExtractor, sessionValidator } = require("../util/middleware");
const { Session } = require("../models");

const router = require("express").Router();

router.delete("/", tokenExtractor, sessionValidator, async (req, res) => {
  await Session.destroy({
    where: { token: req.token },
  });

  res.status(204).end();
});

module.exports = router;
