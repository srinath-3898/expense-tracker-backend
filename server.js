const express = require("express");
const cors = require("cors");
const sequelize = require("./configs/databaseConfig");
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Payment = require("./models/paymentModel");
const ForgotPasswordRequest = require("./models/forgotPasswordRequestModel");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", require("./routes/userRoutes"));
app.use("/expense", require("./routes/expenseRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));
app.use("/premium", require("./routes/premiumRoutes"));

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Payment);
Payment.belongsTo(User);
User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    return app.listen(8080);
  })
  .then(() => console.log("Server running on port 8080"))
  .catch((err) => console.log(err));
