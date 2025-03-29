import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config(); // Ensure this is present to load environment variables

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MongoDb_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to the database");
  } catch (error) {
    console.error("❌ Error connecting to the database:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDb;
