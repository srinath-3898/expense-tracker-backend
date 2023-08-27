const Sequelize = require("sequelize");
const sequelize = require("../configs/databaseConfig");

class User extends Sequelize.Model {}

User.init(
  {
    fullName: { type: Sequelize.DataTypes.STRING(255), allowNull: false },
    email: { type: Sequelize.DataTypes.STRING(255), allowNull: false },
    mobile: { type: Sequelize.DataTypes.STRING(255), allowNull: false },
    password: { type: Sequelize.DataTypes.STRING(255), allowNull: false },
  },
  { sequelize, modelName: "user" }
);

module.exports = User;
