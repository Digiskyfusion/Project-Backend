const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    client_id: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true, 
    },
    image: { 
        type: String,
        required: true,  
    },
    mobileNumber: {
        type: String,  
        required: true,  
    },
    govt_id_proof: {
        type: String,
        required: true,  
    },
    govt_id_number: { 
        type: String,
        unique: true, 
        required: true 
    },
},{ timestamps: true });

module.exports = mongoose.model("Client", clientSchema);
