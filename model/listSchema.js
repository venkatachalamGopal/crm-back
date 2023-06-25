const mongoose = require("mongoose")

const productDetailslistSchema = new mongoose.Schema({
    id:{
        type:String,
        trim:true,
        require:true,
        unique:true

    },
    productname:{
        type:String,
        trim:true,
        require:true
    },
    price:{
        type:String,
        trim:true,
        require:true,
        unique:true
    },
    rating:{
        type:String,
        trim:true,
        require:true,
    },
    quantity:{
        type:String,
        trim:true,
        require:true,
    }

})

module.exports = mongoose.model("productlists",productDetailslistSchema);
