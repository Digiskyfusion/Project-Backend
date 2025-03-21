// Import Mongoose package
import mongoose from "mongoose";

// Define the schema for the package
const packageSchema = new mongoose.Schema({
  name: { type: String }, // Name of the package
  credits: { type: Number }, // Number of credits in the package
  amount: { type: Number }, // Amount of the package
discount:{type:Number}
});

// Create a model based on the schema
const PackageModel = mongoose.model("Package", packageSchema);

// Default packages to be inserted into the database
const defaultPackages = [
  { name: "Basic", credits: 1, amount: 299 },
  { name: "Standard", credits: 3, amount: 499 },
  { name: "Premium", credits: 7, amount: 1499 ,discount:10},
];

// Function to insert default packages into the database
async function insertDefaultPackages() {
  try {
    // Insert default packages into the database
    const packages = await PackageModel.find({});
    if(packages.length === 0){
    await PackageModel.insertMany(defaultPackages);
    console.log("Default packages inserted successfully!");}
  } catch (error) {
    console.error("Error inserting default packages:", error);
  }
}

// Export the model
export default PackageModel;

// Call the function to insert default packages when this module is executed
insertDefaultPackages();
