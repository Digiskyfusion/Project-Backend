import mongoose from "mongoose";
const connectDb = async () => {
mongoose.connect(process.env.MongoDB_URL)
    .then(() =>
        console.log(
            "Connected to database",
        )).catch((err) => {
            console.log("error in connecting database", err)
        })
};
export default connectDb;
