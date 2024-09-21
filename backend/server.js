import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config({});

import { connectMongoClient } from "./config/connection.js";
import { UserRoute } from "./routes/userRouter.js";
import { AuthenticationRoute } from "./routes/authenticationRoute.js";
import { passport } from "./controllers/googleAuthController.js";

const app = express();

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
const corsOptions = {
  origin: ["https://master.d114m935qn6bgy.amplifyapp.com", "http://localhost:3000"],
  credentials: true,
};


app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

connectMongoClient();
const PORT = 3000;
app.use("/", UserRoute);
app.use("/auth", AuthenticationRoute);
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
