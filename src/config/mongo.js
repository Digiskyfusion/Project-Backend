import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config(); // Ensure this is present to load environment variables

const connectDb = async () => {
  try {
    const mongoUrl = process.env.MongoDb_URL; // Get the MongoDB URL
   console.log("mongoUrl");
   console.log(mongoUrl);
    // Check if mongoUrl is defined
    if (!mongoUrl) {
      throw new Error("MongoDb_URL is not defined in the environment variables.");
    }

    console.log("MongoDB URI:", mongoUrl); // Log the MongoDB URI for debugging

    await mongoose.connect(mongoUrl, {
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
