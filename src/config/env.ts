import { z } from "zod";
import "dotenv/config";

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  NODE_ENV: z.enum(["dev", "production"]),
  JWT_SECRET: z.hex(),

  DATABASE_URL: z.string().min(1),

  LLM_PROVIDER: z.enum(["ollama", "openai"]),
  LLM_MODEL: z.string().min(1),

  OLLAMA_BASE_URL: z.string().url()
});

export type Env = z.infer<typeof EnvSchema>;

export const env = EnvSchema.parse(process.env);
