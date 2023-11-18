const express = require("express");
require("dotenv").config()
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleware/errorHandler");
const { customError } = require("./utils/customError");

const app = express();
app.use(express.json());
app.use(cookieParser());
mongoose.connect("mongodb://localhost:27017/mydb");

const userRoute = require("./routes/user");
const adminRoute = require("./routes/adminRoute");

app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.get("/error", (req, res, next) => {
  try {
    jdkdh();
  } catch (err) {
    const error = new customError(err.message, 400);
    next(error);
  }
});
app.use(errorHandler);

app.listen(process.env.PORT, () => console.log("app is running"));
