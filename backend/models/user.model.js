import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleClientId: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

export const User = mongoose.model("User", userSchema);
