const Expense = require("../models/expenseMode");

const getAllExpenses = async (req, res) => {
  try {
    const user = req.user;
    const expenses = await user.getExpenses();
    if (!expenses) {
      return res.status(500).json({
        status: false,
        data: null,
        message:
          "Something went wring while fetching expenses, pleas try again",
      });
    }
    return res
      .status(200)
      .json({ status: true, data: expenses, message: "List of all expenses" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: null,
      message: error.message,
    });
  }
};

const addExpense = async (req, res) => {
  try {
    const { amount, category, description } = req.body;
    if (!amount || !category || !description) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Missing required fields",
      });
    }
    const updatedTotalExpenses = await req.user.update({
      totalExpenses: req.user.totalExpenses + parseFloat(amount),
    });
    if (!updatedTotalExpenses) {
      throw new Error("Something wrong while adding expense, please try again");
    }
    const expense = await req.user.createExpense({
      amount,
      category,
      description,
    });
    if (!expense) {
      return res.status(500).json({
        status: false,
        data: null,
        message: "Something went wring while adding expense, pleas try again",
      });
    }
    return res.status(201).json({
      status: true,
      data: expense,
      message: "Successfully added expense",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: null,
      message: error.message,
    });
  }
};

const editExpense = async (req, res) => {
  try {
    const id = req.params.expenseId;
    if (!id) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Missing expense id",
      });
    }
    const user = req.user;
    const { amount, category, description } = req.body;
    if (!amount || !category || !description) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Missing required fields",
      });
    }
    const expense = await Expense.findOne({ where: { id, userId: user.id } });
    if (!expense) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Expense not found",
      });
    }
    const updatedTotalExpenses = await req.user.update({
      totalExpenses:
        req.user.totalExpenses - expense.amount + parseFloat(amount),
    });
    if (!updatedTotalExpenses) {
      throw new Error("Something wrong while adding expense, please try again");
    }
    const updatedExpense = await expense.update({
      amount,
      category,
      description,
    });
    if (!updatedExpense) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Something went wring while editing expense, pleas try again",
      });
    }
    return res.status(201).json({
      status: true,
      data: updatedExpense,
      message: "Edited expense successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: null,
      message: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const id = req.params.expenseId;
    if (!id) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Missing expense id",
      });
    }
    const user = req.user;
    const expense = await Expense.findOne({ where: { id, userId: user.id } });
    if (!expense) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Expense not found",
      });
    }
    const updatedTotalExpenses = await req.user.update({
      totalExpenses: req.user.totalExpenses - expense.amount,
    });
    if (!updatedTotalExpenses) {
      throw new Error("Something wrong while adding expense, please try again");
    }
    const deletedExpense = await expense.destroy();
    if (!deletedExpense) {
      return res.status(500).json({
        status: false,
        data: null,
        message:
          "Something went wrong while deleting expense, please try again",
      });
    }
    return res.status(200).json({
      status: true,
      data: deletedExpense,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: null,
      message: error.message,
    });
  }
};

module.exports = { getAllExpenses, addExpense, editExpense, deleteExpense };
