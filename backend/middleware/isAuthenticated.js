const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')

dotenv.config({})


const isAuthenticated=(req,res,next)=>{
     try {
        const token=req.cookies.token
        if(!token){
            return res.status(401).json({message:"User not authenticated",success:false})
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        if(!decode){
            res.status(401).json({message:"Invalid token",success:false})
        }
        req.id=decode.userId
        next()
     } catch (error) { 
        console.log(error);
        return res.status(401).json({message:"Error in userauthentication",success:false})
        
     }
}

module.exports={
    isAuthenticated
}