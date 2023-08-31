const express = require("express");
const cors = require("cors");
const sequelize = require("./configs/databaseConfig");
const User = require("./models/userModel");
const Expense = require("./models/expenseMode");
const Payment = require("./models/paymentModel");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", require("./routes/userRoutes"));
app.use("/expense", require("./routes/expenseRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Payment);
Payment.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    return app.listen(8080);
  })
  .then(() => console.log("Server running on port 8080"))
  .catch((err) => console.log(err));
