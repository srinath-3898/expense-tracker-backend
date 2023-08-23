const Sequelize = require("sequelize");
const sequelize = require("../configs/databaseConfig");

const Expense = sequelize.define("expense", {
  amount: {
    type: Sequelize.DataTypes.DOUBLE,
    allowNull: false,
  },
  category: { type: Sequelize.DataTypes.STRING(255), allowNull: false },
  description: { type: Sequelize.DataTypes.STRING(255), allowNull: false },
});

module.exports = Expense;
