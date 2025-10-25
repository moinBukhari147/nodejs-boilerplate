// Import required modules and configuration
import express from "express";
import * as authCtrl from "../../controllers/auth/auth.controller.js";
import { verifyToken, verifyRefreshToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", authCtrl.registerUser);

router.post("/otp-verify", authCtrl.verifyOtp);

router.post("/otp-resend", authCtrl.resendOtp);

router.post("/login", authCtrl.loginUser);

router.post("/token-refresh", verifyRefreshToken, authCtrl.regenerateAccessToken);

router.post("/password/update", verifyToken, authCtrl.updatePassword);

router.post("/password/forgot", authCtrl.forgotPassword);

router.post("/password/otp-verify", authCtrl.forgotPasswordOtpVerify);

router.post("/password/reset", authCtrl.forgotPasswordReset);

export default router;