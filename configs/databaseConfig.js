const Sequelize = require("sequelize");

const sequelize = new Sequelize("expensetracker", "root", "Munnuru@1998", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
});

module.exports = sequelize;
