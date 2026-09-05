require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();

app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false
  //   }
  // },
});

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  },
);

Blog.sync();

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    return res.json(blogs);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// app.get("/api/blogs/:id", async (req, res) => {
//   try {
//     const blog = await Blog.findByPk(req.params.id);
//     res.json(blog);
//   } catch (error) {
//     res.status(404).json({ error });
//   }
// });

app.post("/api/blogs", async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, date: new Date() });
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
    }
    await blog.destroy();
    res.status(204).end();
  } catch (error) {
    return res.status(400).json({ error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
