import { z } from "zod";

export const userSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  password: z.string(),
  name: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  role: z.string().default("user"),
  otp_code: z.string().optional().nullable(),
  otp_expires_at: z.string().optional().nullable(), // or z.date().optional() if parsing dates
  phone_verified: z.boolean().default(false),
  phone_verified_at: z.string().optional().nullable(), // or z.date().optional()
  telegramId: z.string().optional().nullable(),
  createdAt: z.string(), // or z.date()
  updatedAt: z.string(), // or z.date()
  events: z.array(z.any()).optional(), // can replace z.any() with your Event schema
});

export type User = z.infer<typeof userSchema>;
