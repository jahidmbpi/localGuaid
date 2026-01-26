import { Role } from "@prisma/client";
import { z } from "zod";

export const createUserZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(Role).optional().default(Role.TOURIST),
  bio: z.string().optional(),
  language: z.array(z.string()).optional(),
});

export const updateUserZodSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  password: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  bio: z.string().optional(),
  language: z.array(z.string()).optional(),
});
