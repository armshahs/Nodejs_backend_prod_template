import { Request, Response } from "express";
import { AuthService } from "../services";
import { AuthRequest, User } from "../interfaces";

export class AuthController {
  static async signUp(req: Request, res: Response): Promise<void> {
    try {
      // const token = await AuthService.signUp(req.body.email, req.body.password);
      // res.json({ token });
      const { token, userId } = await AuthService.signUp(
        req.body.email,
        req.body.password,
      );
      res.json({ token, userId }); // Include userId in the response
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { token, userId } = await AuthService.login(
        req.body.email,
        req.body.password,
      );
      res.json({ token, userId }); // Include userId in the response
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(401).json({ message: err.message });
    }
  }

  static async getUserDetails(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(400).json({ message: "User not authenticated" });
        return;
      }

      // Access `user` from `req` safely
      const user: User | null = await AuthService.getUserDetails(req.user.id);
      res.json(user);
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
    }
  }

  static async resetPasswordRequest(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      await AuthService.resetPasswordRequest(req.body.email);
      res.json({ message: "Reset email sent" });
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
    }
  }

  static async resetPasswordConfirm(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      await AuthService.resetPasswordConfirm(
        req.body.token,
        req.body.newPassword,
        req.body.confirmPassword,
      );
      res.json({ message: "Password reset successful" });
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
    }
  }
}
