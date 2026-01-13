import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { createLLM } from "./lib/llm/llm.index";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/error";
import compareRouter from "./routes/compare.route";
import journalRouter from "./routes/journal.route";
import summaryRouter from "./routes/summary.route";
import { prisma } from "./config/prisma";

export function createApp() {
  const app = express();
  const llm = createLLM();

  app.use(cookieParser());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan("combined"));
  
  app.get("/", (_req, res) => {
    res.json({ status: "ok" });
  });
  
  app.get("/test-llm", async (req, res) => {
    const { message } = req.body;
    const out = await llm.summarize(message);
    res.json({ out });
  });
  
  app.get("/db-test", async (_req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  });
  
  app.use("/compare", compareRouter);
  app.use("/journal", journalRouter);
  app.use("/summary", summaryRouter);

  app.use(notFound);
  app.use(errorHandler);
  
  return app;
}
