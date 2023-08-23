const express = require("express");
const {
  addExpense,
  getAllExpenses,
  editExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const router = express.Router();

router.post("/add-expense", addExpense);

router.get("/expenses", getAllExpenses);

router.post("/edit-expense/:expenseId", editExpense);

router.delete("/delete-expense/:expenseId", deleteExpense);

module.exports = router;
