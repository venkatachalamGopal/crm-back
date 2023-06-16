const mongoose = require("mongoose")

const userDetailsSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        require:true
    },
    email:{
        type:String,
        trim:true,
        require:true,
        unique:true
    },
    hashedpassword:{
        type:String,
        trim:true,
        require:true,
    },
    role:{
        type:String,
        default:"user",
    },
    token:{
        type:String,
        default:""
    }
})

module.exports = mongoose.model("user",userDetailsSchema);