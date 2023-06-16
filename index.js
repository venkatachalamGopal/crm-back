const express = require("express");
const DbConnection = require("./connection/connect");
const auth = require("./Router/authorization")
const functions = require ("./Router/Functional-Operations")
require("dotenv").config()
const cors = require('cors')
const app = express();

app.use(cors())

app.use(express.json());
app.use("/api",auth);
app.use("/api",functions);



app.listen(process.env.PORT,()=>{

    console.log(`Server Runs on Port ${process.env.PORT}`)
    DbConnection();
})
