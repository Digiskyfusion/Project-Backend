import mongoose from "mongoose";
const connectDb = async () => {
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() =>
        console.log(
            "Connected to database",
        )).catch((err) => {
            console.log("error in connecting database", err)
        })
};
export default connectDb;
