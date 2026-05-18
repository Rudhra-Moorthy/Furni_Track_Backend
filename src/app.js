const express = require("express");
const cors = require("cors");

const loginRouter = require("./routes/loginRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const employeeRouter = require("./routes/employeeRouter");

// App
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", loginRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/employees", employeeRouter);

module.exports = app;
