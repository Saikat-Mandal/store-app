const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies and fileUpload middleware
app.use(cookieParser());
app.use(fileUpload());

// morgan middleware
app.use(morgan("tiny"));

// import all routes here
const home = require("./routes/home");
const user = require("./routes/user");

// router middleware
app.use("/api/v1", home);
app.use("/api/v1", user);

module.exports = app;
