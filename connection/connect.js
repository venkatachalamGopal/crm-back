const dotenv = require("dotenv") 
dotenv.config();

const mongoose = require("mongoose");
 DbConnection = ()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("DB connected");
    }).catch((err)=>{
        console.log(err)
    })
}
module.exports = DbConnection;