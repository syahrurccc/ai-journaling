import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma";
import { registerSchema, loginSchema } from "../validations/zodSchemas";
import { env } from "../config/env";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password } = await registerSchema.parseAsync(req.body);

  const exists = await prisma.user.findUnique({
    where: { email }
  });
  if (exists) {
    return res.status(409).json({ error: "Email is already registered" });
  }

  const hash = await bcrypt.hash(password, 10);
  
  await prisma.user.create({
      data: {
        email,
        password: hash
      }
    });

  res.status(201).json({
    message: "User registered successfully",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(401).json({
      error: "Authentication failed",
    });

  const pass = await bcrypt.compare(password, user.password);
  if (!pass)
    return res.status(401).json({
      error: "Authentication failed",
    });

  // authorize user
  // TODO: Create a refresh token
  const token = jwt.sign(
    {
      id: user.id.toString(),
      email: user.email
    },
    env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 59 * 60 * 1000,
  });
  return res.sendStatus(204);
});

router.get("/logout", (_req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.sendStatus(204);
});

export default router;
