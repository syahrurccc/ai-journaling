import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { createLLM } from "./lib/llm/llm.index";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/error";

export function createApp() {
  const app = express();
  const llm = createLLM();

  app.use(cookieParser());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan("dev"));
  
  app.get("/", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/test-llm", async (_req, res) => {
    const out = await llm.summarize("Today I worked on my journaling app and learned Prisma.");
    res.json({ out });
  });

  app.use(notFound);
  app.use(errorHandler);
  
  return app;
}
