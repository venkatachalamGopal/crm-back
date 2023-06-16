const dotenv = require("dotenv") 
dotenv.config();

const mongoose = require("mongoose");
 DbConnection = ()=>{
    mongoose.connect(process.env.DB_URl).then(()=>{
        console.log("DB connected");
    }).catch((err)=>{
        console.log(err)
    })
}
module.exports = DbConnection;