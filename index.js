const express = require("express");
const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");
const resetRouter = require("./controllers/reset");
const errorHandler = require("./util/errorHandler");
const { syncModels } = require("./models");

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  return res.status(200).json({ message: "ok" });
});
app.use("/api/reset", resetRouter);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  await syncModels(); //race condition fix?
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    process.env.TESTING ? console.log("test environment") : null;
  });
};

start();
