import { Request } from "express";

export interface AuthRequest extends Request {
  user?: { id: string }; // Assuming `user` has at least an `id` field
}
