const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER_NAME,
  process.env.DATABASE_PASSWORD,

  {
    dialect: "mysql",
    host: process.env.DATABASE_HOST,
    logging: false,
  }
);

module.exports = sequelize;
