import express from "express";
import { AuthController } from "../controllers";
import { authenticateJWT } from "../middleware";

const router = express.Router();

router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.login);
router.get("/me", authenticateJWT, AuthController.getUserDetails);
router.post("/reset-password", AuthController.resetPasswordRequest);
router.post("/reset-password-confirm", AuthController.resetPasswordConfirm);

export default router;
