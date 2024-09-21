import express from 'express';
const router = express.Router();
import { loginUser, registerUser, logout, generateRazorpay ,forgotPassword,changePassword ,downloadInvoice,mailInvoice} from '../controllers/userController.js';
import { verifyPayment } from '../controllers/userController.js'
router.route('/').post(loginUser)
router.route('/register').post(registerUser)
router.route('/logout').post(logout)
router.route('/generateRazorpay').post(generateRazorpay)
router.route('/verify-payment').post(verifyPayment)
router.route('/forgot-password').post(forgotPassword)
router.route('/change-password').post(changePassword)
router.route('/download-invoice').post(downloadInvoice) 
router.route('/mail-invoice').post(mailInvoice)
export const UserRoute=router