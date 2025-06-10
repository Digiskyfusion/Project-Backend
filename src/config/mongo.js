import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config(); // Load environment variables

const connectDb = async () => {
  try {
    const mongoUrl = process.env.MongoDb_URL;

    if (!mongoUrl) {
      throw new Error("MongoDb_URL is not defined in the environment variables.");
    }
    await mongoose.connect(process.env.MongoDb_URL); // No need for deprecated options

    console.log("✅ Connected to the database");
  } catch (error) {
    console.error("❌ Error connecting to the database:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDb;
