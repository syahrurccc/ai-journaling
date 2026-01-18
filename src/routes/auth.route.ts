import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { registerSchema, loginSchema } from "../validations/zodSchemas";
import { env } from "../config/env";
import { userRepository } from "../repository/user.repo";
import { AuthenticationError, EmailAlreadyRegisteredError } from "../errors/domain";

const router = Router();
const userRepo = userRepository();

router.post("/register", async (req, res) => {
  const { email, password } = await registerSchema.parseAsync(req.body);

  const exists = await userRepo.findOne(email);
  if (exists) throw new EmailAlreadyRegisteredError();

  const hash = await bcrypt.hash(password, 10);
  
  userRepo.create(email, hash);

  res.status(201).json({
    message: "User registered successfully",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await userRepo.findOne(email);

  const pass = await bcrypt.compare(password, user.password);
  if (!pass) throw new AuthenticationError();

  // authorize user
  // TODO: Create a refresh token
  const token = jwt.sign(
    {
      id: user.id,
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
