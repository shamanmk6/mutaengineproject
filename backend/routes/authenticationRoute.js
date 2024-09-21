import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { googleLogin, googleCallback } from '../controllers/googleAuthController.js';
const router = express.Router();

router.get('/check', isAuthenticated, (req, res) => {
    res.status(200).json({ success: true, message: "Authenticated", user: req.user });
  });
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

export const AuthenticationRoute= router;
