import { AppDataSource } from "../database";
import { User } from "../models";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils";
import { sendResetEmail } from "../utils";
import { ROLES, RoleType } from "../config";

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  static async signUp(
    email: string,
    password: string,
    role: RoleType = ROLES.TEAM_MEMBER,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      email,
      password: hashedPassword,
      role,
    });
    await userRepository.save(user);
    const token = generateToken(user.id, user.role);
    return { token, userId: user.id, role: user.role };
  }

  static async login(email: string, password: string) {
    const user = await userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    const token = generateToken(user.id, user.role);
    return { token, userId: user.id, role: user.role };
  }

  static async getUserDetails(userId: string) {
    return await userRepository.findOne({
      where: { id: userId },
      select: ["id", "email", "role"],
    });
  }

  static async resetPasswordRequest(email: string) {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    const resetToken = generateToken(user.id, user.role);
    user.resetToken = resetToken;
    await userRepository.save(user);

    await sendResetEmail(email, resetToken);
  }

  static async resetPasswordConfirm(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const user = await userRepository.findOne({ where: { resetToken: token } });
    if (!user) throw new Error("Invalid token");

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = "";
    await userRepository.save(user);
  }

  static async deleteUser(userId: string) {
    await userRepository.delete(userId);
  }

  // Get all users - for Admin use
  static async getAllUsers(): Promise<User[]> {
    return await userRepository.find({
      select: ["id", "email", "role"], // Specify the attributes you want to select
    });
  }

  // Update role for a specific user - for Admin use
  static async updateUserRole(
    userId: string,
    role: string,
  ): Promise<User | null> {
    const user = await userRepository.findOne({
      where: { id: userId },
      select: ["id", "email", "role"],
    });
    if (!user) {
      return null; // User not found
    }

    user.role = role as RoleType;

    await userRepository.save(user); // Save updated user
    return user;
  }
}
