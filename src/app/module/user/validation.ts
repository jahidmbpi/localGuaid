import { string } from "./../../../../node_modules/zod/src/v4/core/regexes";
import { Role } from "@prisma/client";
import z, { email } from "zod";

export const createUserZodSchema = z.object({
  name: z.string(),
  email: z.string({ error: "email is required" }).email(),
  password: z.string({ error: "password is required" }),
  role: z.string().optional().default(Role.TOURIST),
  bio: z.string().optional(),
  profilePhoto: z.string().optional(),
  language: z.array(z.string()).optional(),
});

const updateUserZodSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  role: z.string().optional().optional,
  bio: z.string().optional(),
  profilePhoto: z.string().optional(),
  language: z.array(z.string()).optional(),
});
