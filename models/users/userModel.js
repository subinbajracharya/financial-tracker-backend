import userSchema from "./userSchema.js";
import mongoose from "mongoose";

const User = mongoose.model("User", userSchema);

// Get list of users
export const getUsers = () => {
  // list of users
  return User.find();
};

// get user by id
export const getUserById = (id) => {
  return User.findById(id);
};

// get user by filter
export const getUser = (filter) => {
  // filter: {email: 'email'}
  // filter: {username: 'name'}
  return User.findOne(filter);
};

// creat user
export const createUser = (userObj) => {
  return User.insertOne(userObj);
};

// update user
export const updateUser = (id, updateObj) => {
  return User.findByIdAndUpdate(id, updateObj);
};

// delete user
export const deleteUser = (id) => {
  return User.findByIdAndDelete(id);
};
