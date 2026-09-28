const Blog = require("./blog");
const ReadingList = require("./readingList");
const User = require("./user");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

Session.belongsTo(User);
User.hasMany(Session);

User.belongsToMany(Blog, { through: ReadingList, as: "readings" });

module.exports = {
  Blog,
  User,
  ReadingList,
};
