import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { getDb } from "../config/connection.js";
import { USER_COLLECTION } from "../config/collections.js";
dotenv.config({});

const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await getDb()
          .collection(USER_COLLECTION)
          .findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          user = {
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
          };

          const insertResult = await getDb()
            .collection(USER_COLLECTION)
            .insertOne(user);

          if (insertResult.insertedCount > 0) {
            console.log("New user created and saved to database", user);
          } else {
            console.log("Failed to save the user to the database");
            return done(new Error("Failed to save user to the database"), null);
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
const googleCallback = (req, res, next) => {
  console.log("inside google call back");

  passport.authenticate("google", (err, user, info) => {
    console.log(user);

    if (err || !user) {
      return res.redirect("http://127.0.0.1:5173");
    }
    try {
      const payLoad = { userId: user._id };
      const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      const username = encodeURIComponent(user.username);
      const email = encodeURIComponent(user.email);
      res.redirect(
        `http://127.0.0.1:5173/home?username=${username}&email=${email}`
      );
    } catch (error) {
      console.log("Error during Google login:", error);
      return res.status(500).json({ message: "Server error", success: false });
    }
  })(req, res, next);
};
export { googleLogin, googleCallback, passport };
