require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB");
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("Server running at port", PORT);
});
