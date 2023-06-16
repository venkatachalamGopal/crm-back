const express = require("express");
const router = express.Router();
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const { set } = require("mongoose");
const {auth} = require("../middelware/middelware");
require("dotenv").config();

const key = process.env.EMAIL_SECRET_KEY;
const mail = process.env.EMAIL_OWNER



//nodemailer ...
 let forgetmailer = async(name,email,token)=>{
 try {
    let transport = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
            user:mail,
            pass:key
        }
    })

    let message={
        from:process.env.EMAIL_OWNER,
        to:email,
        subject:"Reset Password",
        text:"please click the link for reset your password",
        html:
        `<p> Hi ${name} !
           please click  <a href ="http://localhost:3000/reset-password/${token}"  target="_blank"   >here</a> to rest your password
        `
    }

    transport.sendMail(message).then((data)=>{
        console.log('Mail is Send you in box')
    }).catch((err)=>{
        console.log(err);
        console.log('somthing went worng');
    })
 } catch (error) {
    console.log(error)
 }
 }

//authendication ......... 

const jwtVerification = (req,res,next)=>{
    const token = req.header.token;
    if(!token){
       return res.status(401).json("Un Authorized")
    }else{
        let verify = jwt.verify(token,process.env.SECRET_KEY,(err,decode)=>{
            if(err){
                return res.status(401).json("Un Authorized")
            }
            req._id= decode.id;
            next()
        })
    }
}
router.post("/signup",async(req,res)=>{
    try {
        let payload = req.body
        const user_avaialbe = await User.findOne({email:payload.email})
        if(!user_avaialbe){
            payload.hashedpassword = await bcrypt.hash(payload.password,10);
            let userdata = new User (payload);
            userdata.save()
            res.status(200).json({"responce":1,message:"signup successfully"})
        }else{
            res.status(400).json("User is Exist")
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json("somthing went worng")
    }
})

router.post('/signin',async(req,res)=>{
    try {
       // console.log(req.body)
        let payload =  req.body;
        const user_avaialbe = await User.findOne({email:payload.email})
        if(!user_avaialbe){
            return res.status(400).json("User not Exist");
        }
         //console.log(user_avaialbe)
        User.findOne({email:payload.email}).then(async(data)=>{
            let valid_user = await bcrypt.compare(payload.password,data.hashedpassword);
            console.log(valid_user)
            if(valid_user){
                let user ={email:data.email,name:data.name,id:data._id}
                const token = jwt.sign(user,process.env.SECRET_KEY,{expiresIn: '40m'});
                res.cookie("t",token)
                res.status(200).json({details:{email:data.email,name:data.name,role:data.role,id:data._id,Issignin:"true"},token});
            }else{
                res.status(404).json("password is Wrong !")
            }

        }).catch((err)=>{
            console.log(err)
            res.status(404).json("Somthing Went Worng")
        })
        

    } catch (error) {
        res.status(404).json("Somthing went Worng Please Try Agin");
    }
})

 router.get("/signout",(req,res)=>{
    res.clearCookie('t')
    res.status(200).json("Successfuly Sign Out")
 })

 //forget-password
 router.post('/forget-password',async(req,res)=>{
    let payload = req.body;
   // console.log(payload)
    try {
        let validUser = await User.findOne({email:payload.email})
        console.log('validuser',validUser)
        if(validUser){
            let randomstring_key = randomstring.generate();
            let token_key = jwt.sign({username:validUser.name,_id:validUser._id},randomstring_key,{expiresIn:"10m"})
            ///console.log(token_key)
            validUser.token=token_key
            await User.findOneAndUpdate({email:validUser.email},{$set:validUser}).then((data)=>{
           // console.log(data)
           }).catch((err)=>{
            console.log(err)
           })
          // console.log(data)
                forgetmailer(validUser.name,validUser.email,token_key)
                res.status(201).json({"responce":1,message:"please check your valid email inbox. The password reset link will be send "})
        }else{
            res.status(400).json("Player is not Exist")
        }
    } catch (error) {
     console.log(error)   
     res.status(400).json("Somthing Went Worng ! please try agin")
    }
 })

 router.post('/reset-password',async(req,res)=>{
    let payload = req.body;
    try {
        let user = await User.findOne({token:payload.token})
        if(user){
            let hashedpassword = await bcrypt.hash(payload.password,10);
            User.findOneAndUpdate({_id:user._id},{$set:{hashedpassword,token:''}}).then((data)=>{
                res.status(201).json({"responce":1,message:"Password Updated Successfuly !"})
            }).catch((err)=>{
                console.log(err)
                res.status(400).json("Somthing Went Worng ! Please Try again");
            })
        }else{
          res.status(400).json("unauthorised ! Please click the link on your email")
        }
    } catch (error) {
        res.status(400).json("Somthing Went Worng ! please try agin")
    }
 })


module.exports = router;