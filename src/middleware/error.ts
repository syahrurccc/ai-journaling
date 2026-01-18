import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import {
  AuthenticationError,
  EmailAlreadyRegisteredError,
  InvalidDateRangeError,
  JournalNotFoundError,
  UnauthorizedAccessError
} from "../errors/domain";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    console.log(err.issues);
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues,
    });
  }
  
  if (err instanceof AuthenticationError) {
    console.log(err.name, err.name);
    return res.status(401).json({
      error: err.message
    });
  }
  
  if (err instanceof EmailAlreadyRegisteredError) {
    console.log(err.name, err.name);
    return res.status(405).json({
      error: err.message
    });
  }
  
  if (err instanceof InvalidDateRangeError) {
    console.log(err.name, err.name);
    return res.status(400).json({
      error: err.message
    });
  }
  
  if (err instanceof JournalNotFoundError) {
    console.log(err.name, err.name);
    return res.status(404).json({
      error: err.message
    });
  }
  
  if (err instanceof UnauthorizedAccessError) {
    console.log(err.name, err.name);
    return res.status(401).json({
      error: err.message
    });
  }

  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";

  res.status(status).json({ error: message });
}
