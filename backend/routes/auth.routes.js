import express from "express";
import { register, resetPassword, sendResetOtp, login, logout, verifyAccount } from "../controllers/auth.controller.js";
import { tempUserAuth } from "../middlewares/tempUserAuth.middleware.js";
import { verifyOtpRateLimit } from "../middlewares/verifyOtpRateLimit.middleware.js";

const authRouter = express.Router();

// Public Routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.put('/reset-password', resetPassword);

// Temp-users Route
authRouter.get('/is-temp-auth', tempUserAuth, (req, res) => {
    return res.status(200).json({
        success : true,
        message : "Temporary user authenticated."
    });
});
authRouter.post('/verify-account', tempUserAuth, verifyOtpRateLimit, verifyAccount);

export default authRouter;