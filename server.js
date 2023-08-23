const express = require("express");
const cors = require("cors");
const sequelize = require("./configs/databaseConfig");
const Expense = require("./models/expenseMode");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/expense", require("./routes/expenseRoutes"));

Expense.sync()
  .then(() => console.log("Expense table synced"))
  .catch((err) => console.log(err));
sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    return app.listen(8080);
  })
  .then(() => console.log("Server running on port 8080"))
  .catch((err) => console.log(err));
