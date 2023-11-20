const mongoose = require("mongoose");
const express = require("express");
const todoRouter = require("./routes/todos");
const cors = require("cors");
require("dotenv").config();

//...................

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api", todoRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("Mongo connection established");
    });
  } catch (error) {
    console.error(error);
  }
};

app.listen(5000, () => {
  console.log("listening on port 5000!!!");
});

start();
