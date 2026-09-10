require("dotenv").config();
const testing = process.env.TESTING;

module.exports = {
  DATABASE_URL: testing
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
};
