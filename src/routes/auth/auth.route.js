// Import required modules and configuration
import express from "express";
import { loginUser, registerUser, forgotPassword, verifyOtp, setNewPassword, regenerateAccessToken, updatePassword } from "../../controllers/auth/auth.controller.js";
import verifyToken from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.post("/regenerate-access-token", regenerateAccessToken);

router.post("/password/update", verifyToken, updatePassword);

router.post("/password/forgot", verifyToken, forgotPassword);

router.post("/password/verify-otp", verifyToken, verifyOtp);

router.post("/password/reset", verifyToken, setNewPassword);

export default router;