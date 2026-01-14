import { z } from "zod";

const baseRegisterSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8),
  confirmation: z.string().min(8),
});

export const registerSchema = baseRegisterSchema.refine(
  (s) => s.password === s.confirmation,
  {
    message: "Password must match",
    path: ["confirmation"],
  }
);

export const loginSchema = z
  .object({
    email: z.email().trim(),
    password: z.string().min(8),
  })
  .strict();

export const journalSchema = z
  .object({
    content: z.string()
  });

export const journalQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const idSchema = z.string().uuid();