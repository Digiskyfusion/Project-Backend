require('dotenv').config();
const mongoose= require("mongoose");
let URL= process.env.MongoDB_URL

const connectionDB= async ()=>
{
    try {
       await mongoose.connect(URL);
       console.log(`running succesfully`);
       
    } catch (error) {
        console.log(error);
        
    }
}
module.exports= connectionDB;