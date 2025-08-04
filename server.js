import express from "express";
import cors from "cors";
import mongoConnection from "./config/mongoConfig.js";
import dotenv from "dotenv";
import { loginUser, registerUser } from "./controllers/authControllers.js";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "./controllers/transactionControllers.js";
import { auth } from "./middleware/authmiddleware.js";
import { getTransactionsByUserId } from "./models/transactions/transactionModel.js";

dotenv.config();
const app = express();

// GET PORT
const PORT = process.env.PORT || 4000;

const middlewareFunction = (req, res, next) => {
  console.log("MIDDLEWARE");

  next();
};

// cors
app.use(cors());

// request body
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "I AM ALIVE",
  });
});

// AUTH
// POST request to register users
app.post("/api/v1/auth", registerUser);
// login
app.post("/api/v1/auth/login", loginUser);

// verify email
// app.get("/verify-email", verifyEmail)

// get user Detaul
app.get("/api/v1/auth/user", auth, (req, res) => {
  return res.json({
    status: true,
    message: "User Detail Fetched!",
    user: req.user,
  });
});

// dashboard api
app.get("/api/v1/dashboard", auth, async (req, res) => {
  let userId = req.user._id;

  let transactions = await getTransactionsByUserId(userId);

  console.log(">>>>>", transactions);

  transactions.sort((a, b) => b.date - a.date);

  let income = transactions.reduce((acc, item) => {
    return item.type === "income" ? acc + item.amount : acc;
  }, 0);

  let expense = transactions.reduce((acc, item) => {
    return item.type === "expense" ? acc + item.amount : acc;
  }, 0);

  let balance = income - expense;

  let responseObject = {
    status: true,
    message: "Metrics",
    metrics: {
      income,
      expense,
      balance,
      transaction_no: transactions.length,
      activities: transactions,
    },
  };

  return res.json(responseObject);
});

// transaction
// create a transaction
app.post("/api/v1/transactions", auth, createTransaction);

// // get a transaction
app.get("/api/v1/transactions", auth, getTransactions);

// // dete a transaction
app.delete("/api/v1/transactions/:id", auth, deleteTransaction);

// update transaction
app.patch("/api/v1/transactions/:id", auth, updateTransaction);

// mongo connection
mongoConnection()
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log("SERVER COULD NOT STARTED"); ``
      } else {
        console.log("SERVER STARTED AT PORT: ", PORT);
      }
    });
  })
  .catch((err) => {
    console.log(err.message);
    console.log("MONGO DB CONNECTION ERROR");
  });
