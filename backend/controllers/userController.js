import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import nodeMailer from "nodemailer";
import fs, { WriteStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import PDFDocument from "pdfkit";
import { ObjectId } from "mongodb";
import otpGenerator from "otp-generator";
import { getDb } from "../config/connection.js";
import { USER_COLLECTION } from "../config/collections.js";
import { User } from "../models/user.model.js";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let invoiceCounter = 1;

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Something is missing", success: false });
    }
    const user = await getDb().collection(USER_COLLECTION).findOne({ email });
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
    await getDb().collection(USER_COLLECTION).insertOne(newUser);
    return res
      .status(200)
      .json({ message: "User registered Successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error in registering user", success: false });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email or password is missing", success: false });
    }
    let user = await getDb().collection(USER_COLLECTION).findOne({ email });
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
    const payLoad = { message: "User login successful", userId: user._id };
    const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    user = { _id: user._id, username: user.username, email: user.email };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        message: `Welcome ${user.username}`,
        success: true,
        user,
        token,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const logout = (req, res) => {
  try {
    res.setHeader(
      "Set-Cookie",
      "token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0"
    );
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 0,
    });
    return res
      .status(200)
      .json({ message: "Logged out Successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error in logging out", success: false });
  }
};

export const generateRazorpay = (req, res) => {
  try {
    const { totalPrice } = req.body;
    const amountInPaisa = Math.round(totalPrice * 100);
    const options = {
      amount: amountInPaisa,
      currency: "INR",
    };
    instance.orders.create(options, (err, order) => {
      if (err) {
        console.log(err);
        return res
          .status(400)
          .json({ message: "Error in payment", success: false });
      } else {
        return res
          .status(200)
          .json({ message: "Razorpay payment created", success: true, order });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const verifyPayment = (req, res) => {
  try {
    const { payment, order } = req.body;
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    hmac.update(order.id + "|" + payment.razorpay_payment_id);
    const calculatedSignature = hmac.digest("hex");

    if (calculatedSignature === payment.razorpay_signature) {
      return res
        .status(200)
        .json({ message: "Payment completed", success: true });
    } else {
      return res
        .status(400)
        .json({ message: "Payment verification failed", success: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    let user = await getDb()
      .collection(USER_COLLECTION)
      .findOne({ email: email });
    if (!user) {
      console.log("inside no user");

      return res
        .status(400)
        .json({ message: "User with this mail doesn't exist", success: false });
    }

    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user:process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let userId = user._id;
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const mailOptions = {
      from:process.env.SMTP_EMAIL,
      to: email,
      subject: "For verification mail",
      text: `Your otp is: ${otp}`,
    };
    const info = await transporter.sendMail(mailOptions);

    if (info) {
      return res
        .status(200)
        .json({ message: "OTP sent successfully", success: true, userId, otp });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to send OTP", success: false });
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const changePassword = async (req, res) => {
  try {
    let { newPassword, userId } = req.body;
    let hashedPassword = await bcrypt.hash(newPassword, 10);
    let changePassword = await getDb()
      .collection(USER_COLLECTION)
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: hashedPassword } }
      );
    return res
      .status(200)
      .json({ message: "Password Changed Successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error in changing password", success: false });
  }
};
export const downloadInvoice = (req, res) => {
  try {
    const publicDir = path.join(__dirname, "..", "public", "files");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const filePath = path.join(publicDir, `invoice${invoiceCounter}.pdf`);
    invoiceCounter++;
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(25).text("Sample Invoice", 100, 100);
    doc.fontSize(12).text("Sl No.", 100, 150, { underline: true });
    doc.text("Name of Product", 150, 150, { underline: true });
    doc.text("Quantity", 300, 150, { underline: true });
    doc.text("Price", 400, 150, { underline: true });

    const items = [
      { name: "Item 1", quantity: 1, price: 10.0 },
      { name: "Item 2", quantity: 2, price: 20.0 },
    ];

    let y = 170;
    items.forEach((item, index) => {
      doc.text(index + 1, 100, y);
      doc.text(item.name, 150, y);
      doc.text(item.quantity, 300, y);
      doc.text(`$${item.price.toFixed(2)}`, 400, y);
      y += 20;
    });

    const totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    doc.text("Total", 300, y, { underline: true });
    doc.text(`$${totalPrice.toFixed(2)}`, 400, y, { underline: true });

    writeStream.on("finish", () => {
      console.log("inside finish");

      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.log("Error accessing file:", err);
          return res.status(500).send("Error accessing file");
        }

        res.download(filePath, "invoice.pdf", (err) => {
          if (err) {
            console.log("Error in downloading file:", err);
            return res.status(500).send("Error downloading file");
          }
        });
      });
    });
    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const mailInvoice = async (req, res) => {
  try {
    let user = req.body;
    user = user.user.user;
    const email = user.email;
    const publicDir = path.join(__dirname, "..", "public", "files");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const filePath = path.join(publicDir, `invoice${invoiceCounter}.pdf`);
    invoiceCounter++;
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.fontSize(25).text("Sample Invoice", 100, 100);
    doc.fontSize(12).text("Sl No.", 100, 150, { underline: true });
    doc.text("Name of Product", 150, 150, { underline: true });
    doc.text("Quantity", 300, 150, { underline: true });
    doc.text("Price", 400, 150, { underline: true });

    const items = [
      { name: "Item 1", quantity: 1, price: 10.0 },
      { name: "Item 2", quantity: 2, price: 20.0 },
    ];

    let y = 170;
    items.forEach((item, index) => {
      doc.text(index + 1, 100, y);
      doc.text(item.name, 150, y);
      doc.text(item.quantity, 300, y);
      doc.text(`$${item.price.toFixed(2)}`, 400, y);
      y += 20;
    });

    const totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    doc.text("Total", 300, y, { underline: true });
    doc.text(`$${totalPrice.toFixed(2)}`, 400, y, { underline: true });

    writeStream.on("finish", async () => {
      console.log("inside finish");
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user:process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      const mailOptions = {
        from:process.env.SMTP_EMAIL,
        to: email,
        subject: "Your Invoice",
        text: `Please find the attached your invoice`,
        attachments: [
          {
            filename: "inovice.pdf",
            path: filePath,
          },
        ],
      };
      const info = await transporter.sendMail(mailOptions);
    });
    doc.end();
    return res.status(200).json({
      message: "Invoice has been sent to your email !",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error in sending invoice", success: false });
  }
};
