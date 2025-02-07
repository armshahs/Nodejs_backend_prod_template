import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { config } from "../config";

dotenv.config();

export const generateToken = (id: string) => {
  return jwt.sign({ id }, config.auth.jwtSecret as string, {
    expiresIn: "720h",
  });
};
