const db = require("../config/connection");
const collection = require("../config/collections");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Razorpay=require('razorpay')
const crypto=require('crypto');
const { log } = require("console");

dotenv.config({});
var instance=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET
})

const registerUser = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Something is missing", success: false });
    }
    const user = await db
      .getDb()
      .collection(collection.USER_COLLECTION)
      .findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User is already registered", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await db.getDb().collection(collection.USER_COLLECTION).insertOne(newUser);
    return res
      .status(200)
      .json({ message: "User registered Successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Error in registering user", success: false });
  }
};
const registerUserWithGoogle=()=>{

}
const loginWithGoogle=()=>{

}
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email or password is missing", success: false });
    }
    let user = await db
      .getDb()
      .collection(collection.USER_COLLECTION)
      .findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not exist", success: false });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Password is incorrect", success: false });
    }
    const payLoad = { message: "User login successfull", userId: user._id };
    const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
    if (token) {
      return res
        .status(200)
        .cookie("token", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpsOnly: true,
          sameSite: "strict",
        })
        .json({ message: `Welcome ${user.username}`, success: true, user });
    } else {
      return res.status(400).json({message:"Server error",success:false});
    }
  } catch (error) {
    console.log(error);
  }
};

const logout=(req,res)=>{
    try {
        return res.status(200).cooke("token","",{maxAge:0}).json({message:"Loggedout Successfully",success:true})
    } catch (error) {
        console.log(error);   
    }
}

const generateRazorpay=(req,res)=>{
     try {
        let totalPrice=req.total
        const amountInPaisa=MATH.round(totalPrice*100)
        var options={
            amount:amountInPaisa,
            currency:"INR",
            reciept:"123"
        }
        instance.orders.create(options,function(err,order){
           if(err){
            console.log(err)
            return res.status(400).json({message:"Error in payment",success:false})
           }else{
            console.log("Payment is: ",order);
             return res.status(200).json({message:"Razorpay payment done",success:true})
           }
        })
     } catch (error) {
        console.log(error);
        
     }
}
const verifyPayment=(req,res)=>{
        let paymentDetails=req.paymentDetails
        let hmac=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET)

        hmac.update(
            paymentDetails["payment[razorpay_order_id"]+
            "|"+
            paymentDetails["payment[razorpay_payment_id]"]
        )
        let calculatedSignature=hmac.digest("hex");

        if(calculatedSignature === paymentDetails["payment[razorpay_signature]"]){
            return res.status(200).json({message:"payment completed",success:true})
        }else{
            return res.status(400).json({message:"Error with payment completeion",success:false})
        }
}

module.exports = {
  registerUser,
  loginUser,
  logout,
  generateRazorpay,
  verifyPayment,
};
