import { Role } from "@prisma/client";

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}