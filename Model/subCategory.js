const mongoose = require("mongoose")

const subCategory=  new mongoose.Schema({
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"category",
        require: true,
    },
    name: {
        type: String,
        require : true
    }
})

module.exports= mongoose.model("subCategory", subCategory);