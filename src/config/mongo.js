import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MongoDb_Url, {
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
