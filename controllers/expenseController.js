const Expense = require("../models/expenseMode");

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
    const expense = await Expense.create({ amount, category, description });
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

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
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
    const { amount, category, description } = req.body;
    if (!amount || !category || !description) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Missing required fields",
      });
    }
    const expense = await Expense.findOne({ where: { id } });
    if (!expense) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Expense not found",
      });
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
    const expense = await Expense.findOne({ where: { id } });
    if (!expense) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Expense not found",
      });
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

module.exports = { addExpense, getAllExpenses, editExpense, deleteExpense };
