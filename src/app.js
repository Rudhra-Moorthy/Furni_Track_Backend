const express = require("express");
const cors = require("cors");

const loginRouter = require("./routes/loginRouter");
const userRouter = require("./routes/userRouter");

// App
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", loginRouter);
app.use("/api/users", userRouter);

module.exports = app;
