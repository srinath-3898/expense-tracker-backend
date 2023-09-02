const sequelize = require("../configs/databaseConfig");
const Expense = require("../models/expenseMode");
const User = require("../models/userModel");

const leaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: [
        "id",
        "fullName",
        [
          sequelize.fn("SUM", sequelize.col("Expenses.amount")),
          "totalExpenses",
        ],
      ],
      include: [{ model: Expense, attributes: [] }],
      group: ["User.id"],
      order: [[sequelize.literal("totalExpenses"), "DESC"]],
    });
    if (!leaderboard) {
      throw new Error(
        "Something went wrong while fetching expenses, please try again"
      );
    }
    return res
      .status(200)
      .json({ status: true, data: leaderboard, message: "Leaderboard" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, data: null, message: error.message });
  }
};

module.exports = { leaderboard };
