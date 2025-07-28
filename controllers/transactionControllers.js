import {
  deleteTransactionByUserId,
  getTransactionsByUserId,
  insertTransaction,
  updateTransactionByUserId,
} from "../models/transactions/transactionModel.js";

// Create transaction
export const createTransaction = async (req, res) => {
  try {
    let transactionObject = req.body;

    // add user id to transactionObject
    transactionObject.userId = req.user._id;

    // create new transaction
    let newTransaction = await insertTransaction(transactionObject);

    return res.status(201).json({
      status: true,
      message: "Transaction Created",
      trasaction: newTransaction,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// get user transactions
export const getTransactions = async (req, res) => {
  try {
    // fetch the trasactions
    let userId = req.user._id;

    let transactions = await getTransactionsByUserId(userId);

    return res.status(200).json({
      status: true,
      message: "Trasactions fetched!",
      transactions,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Failed to fetch transactions",
    });
  }
};

// delete transaction api

export const deleteTransaction = async (req, res) => {
  try {
    // fetch the trasactions
    // auth middleware
    let userId = req.user._id;
    let tid = req.params.id;

    let transaction = await deleteTransactionByUserId(tid, userId);

    return res.status(200).json({
      status: true,
      message: "Trasactions deleted!",
      transaction,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Failed to delete transactions",
    });
  }
};

// delete multiple transaction api

// update transaction api
export const updateTransaction = async (req, res) => {
  try {
    let userId = req.user._id;

    // transaction id
    let tid = req.params.id;
    let updateData = req.body;
    // { amount, date, type desc}

    let updatedTransaction = await updateTransactionByUserId(
      tid,
      userId,
      updateData
    );

    return res.json({
      status: true,
      message: "Transaction Updated",
      transaction: updatedTransaction,
    });

    // query function
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Failed to update transactions",
    });
  }
};
