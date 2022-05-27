import express from 'express';
import controller from "../controllers/auth.controller";
import { checkJwt } from '../middleware/checkToken';
const router = express.Router();

//Login route
router.post("/login", controller.loginUser);

//forgot password(get otp)
router.post("/forgot-password", controller.forgotPassword);

//verify otp
router.post("/verify-otp", controller.matchOtp);

//Reset password
router.put("/reset-password-otp", controller.resetPasswordWithOtp);

//Change my password
router.put("/change-password", [checkJwt], controller.changePassword);

export default router;   