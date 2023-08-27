const express = require("express");
const cors = require("cors");
const sequelize = require("./configs/databaseConfig");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", require("./routes/userRoutes"));
app.use("/expense", require("./routes/expenseRoutes"));

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    return app.listen(8080);
  })
  .then(() => console.log("Server running on port 8080"))
  .catch((err) => console.log(err));
