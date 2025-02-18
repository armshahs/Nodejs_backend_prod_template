import { Request, Response } from "express";
import { AuthService } from "../services";
import { AuthRequest, User } from "../interfaces";
import { ROLES } from "../config";

export class AuthController {
  static async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { token, userId, role } = await AuthService.signUp(
        req.body.email,
        req.body.password,
        req.body.role,
      );
      res.json({ token, userId, role });
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { token, userId, role } = await AuthService.login(
        req.body.email,
        req.body.password,
      );
      res.json({ token, userId, role });
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

  // Controller method for getting all users
  static async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await AuthService.getAllUsers();
      res.json(users);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }

  // PATCH specific user's role
  static async updateUserRole(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!role) {
        res.status(400).json({ message: "Role is required." });
        return;
      }

      // Validate if the role is one of the allowed roles
      if (!Object.values(ROLES).includes(role)) {
        res.status(400).json({
          message: `Invalid role. Allowed roles are: ${Object.values(ROLES).join(", ")}`,
        });
        return;
      }

      const updatedUser = await AuthService.updateUserRole(userId, role);

      if (!updatedUser) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      res.json(updatedUser);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }
}
