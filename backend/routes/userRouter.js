const express=require('express')
const router=express.Router()
const {loginUser,registerUser,logout} =require('../controllers/userController')

router.route('/').post(loginUser)
router.route('/register').post(registerUser)
router.route('/logout').post(logout)

module.exports=router;