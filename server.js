import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const router = require("./routes/auth");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DATABASE CONNECTED"))
  .catch((error) => console.log("ERROR IN THE DATABASE CONNECTION", error));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", router);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Port what???, Port ${port}`));
