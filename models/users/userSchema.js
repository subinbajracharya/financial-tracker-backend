import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default userSchema;
