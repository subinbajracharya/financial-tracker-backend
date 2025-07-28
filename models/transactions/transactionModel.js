import mongoose from "mongoose";
import transactionSchema from "./transactionSchema.js";

const Transaction = mongoose.model("Transaction", transactionSchema);

// get transactions
export const getTransactionsByUserId = (userId) => {
  return Transaction.find({ userId: userId });
};

// create transaction
export const insertTransaction = (transactionObj) => {
  return Transaction.insertOne(transactionObj);
};

// delete Transaction
export const deleteTransactionByUserId = (id, userId) => {
  return Transaction.findOneAndDelete({ _id: id, userId: userId });
};

// delete multiple transactions
// [1,2,3]
export const deleteTransactionsByUserId = (idsToDelete, userId) => {
  return Transaction.deleteMany({
    _id: { $in: idsToDelete },
    userId: userId,
  });
};

// update transaction
export const updateTransactionByUserId = (tid, userId, tObject) => {
  return Transaction.findOneAndUpdate({ _id: tid, userId }, tObject, {
    new: true,
  });
};
