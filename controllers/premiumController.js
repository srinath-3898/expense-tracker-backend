const Expense = require("../models/expenseMode");
const User = require("../models/userModel");

const leaderboard = async (req, res) => {
  try {
    const users = await User.findAll();
    if (!users) {
      throw new Error(
        "Something went wrong while fetching expenses, please try again"
      );
    }
    const expenses = await Expense.findAll();
    if (!expenses) {
      throw new Error(
        "Something went wrong while fetching expenses, please try again"
      );
    }
    const totalExpenses = {};
    for (const expense of expenses) {
      const { userId, amount } = expense;
      if (totalExpenses[userId]) {
        totalExpenses[userId] += amount;
      } else {
        totalExpenses[userId] = amount;
      }
    }
    const leaderboard = users.map((user) => ({
      userId: user.id,
      name: user.fullName,
      totalExpenses: totalExpenses[user?.id],
    }));
    leaderboard.sort((a, b) => b.totalExpenses - a.totalExpenses);
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
