const express = require("express");
const User = require("../model/listSchema");
const {jwtVerification,auth} = require("../middelware/middelware");

const{v4}=require("uuid")
 
const  router = express.Router();
 router.post("/add",jwtVerification,auth(["staff","manager"]),async(req,res)=>{
    let payload = req.body;
   // let listofdata =  await User.find()
   payload.id =v4();
   console.log(payload.email)
    let already_user = await User.findOne({id:payload.id});
    if(!already_user){
     let newOne = new User(payload);
       newOne.save().then((data)=>{
        console.log(data);
        res.status(201).json({"responce":1,message:"Product added Successfuly"})
       })
    }else{
         res.status(400).json("User already Exist !")
    }
 })
 
 router.post("/many",(req,res)=>{
     User.insertMany(req.body).then((data)=>{
      res.json(data);
     }).catch((err)=>{
      console.log(err);
      res.json(err)
     })
   

 })

 router.get("/list",(req,res)=>{
   User.find().then((data)=>{
      res.status(200).json(data);
   }).catch((err)=>{
      res.status(404).json({Error:"Somthing went Wrong ! please try again"})
   })
 })
 router.get("/edit/:id",jwtVerification,auth(["staff","manager"]),async(req,res)=>{
   let id = req.params.id
  let singleUserdetails= await User.findOne({id:id})
  //console.log(singleUserdetails)
   if(singleUserdetails){
      res.status(200).send(singleUserdetails)
   }else{
      res.status(400).send("somthing Went Worng ! please try again");
   }
 })
 router.post("/update/:id",jwtVerification,auth(["staff","manager"]),(req,res)=>{
   let payload = req.body;
   let id = req.params.id
   User.findOneAndUpdate({id:id} ,{ $set: req.body}).then((data)=>{
      res.status(201).json({"responce":1,message:"update Successfuly"})
   }).catch((err)=>{
      console.log(err);
      res.status(400).json("Somthing went worng ! plaease try again")
   })
 
 })
 router.delete("/delete/:id",jwtVerification,auth(["manager"]),(req,res)=>{
   let id = req.params.id;
   User.findOneAndDelete({id:id}).then((data)=>{
      res.status(200).json({"responce":1,message:"Deleted successfuly"})
   }).catch((err)=>{
      console.log(err);
      res.status(401).json("somthing Went Worng ! please try again");
   })
 })
 
 module.exports = router;