import { AppDataSource } from "../database";
import { User } from "../models";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils";
import { sendResetEmail } from "../utils";

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  static async signUp(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({ email, password: hashedPassword });
    await userRepository.save(user);
    const token = generateToken(user.id);
    return { token, userId: user.id }; // Return both token and userId
  }

  static async login(email: string, password: string) {
    const user = await userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    const token = generateToken(user.id);
    return { token, userId: user.id }; // Return both token and userId
  }

  static async getUserDetails(userId: string) {
    return await userRepository.findOne({
      where: { id: userId },
      select: ["id", "email"],
    });
  }

  static async resetPasswordRequest(email: string) {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    const resetToken = generateToken(user.id);
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
}
