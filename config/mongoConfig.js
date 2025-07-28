import mongoose from "mongoose";

const mongoConnection = () => {
  return mongoose.connect(process.env.MONGO_URL);
};

export default mongoConnection;
