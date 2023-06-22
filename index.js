const express = require("express");
const app = require("./app");
require("dotenv").config();
app.listen(process.env.PORT, () => console.log("listening to port 3000"));
