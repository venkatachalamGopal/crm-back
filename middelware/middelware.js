const jwt = require("jsonwebtoken")
const dotenv = require("dotenv") 

dotenv.config();
const key = process.env.SECRET_KEY
const auth =(permission)=>{
return (req,res,next)=>{
    let user_role = req.headers["role"];
    //console.log(user_role)
    if(permission.includes(user_role)){
        next();
    }else{
        res.status(401).json("Unauthorised  ! You can't Access ");
    }
}
}
const jwtVerification = async(req,res,next)=>{
  
    const token= req.headers["token"]
   // console.log(token)
    if(!token){
     return  res.status(401).send("Un Authorized Token is not availbe")
    }else{
          
      jwt.verify(token,key,(error,data)=>{
        if(error){
          console.log(error)
          if(error==="jwt expired"){
           res.status(400).json("jwt expired")
          }
          res.status(401).send("Un Authorized")
        }
        req.user = data
        next()
      })



      //  console.log(key)
      //  let user = await jwt.verify(token,key,(err,decode)=>{
      //       if(err){
      //           if(err){
      //             return 'jwt expired'
      //           }
      //       
      //       }
      //       return decode
      //       // req.user= decode;
      //       // next()
      //   })
      //   if(user === "jwt expired"){
      //     res.status(400).json("jwt expired")
      //   }else{
      //     req.user = user
      //     next()
      //   }
    }
}


module.exports ={auth,jwtVerification}