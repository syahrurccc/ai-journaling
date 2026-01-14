import { createOllamaProvider } from "./providers/ollama";
import { createOpenAIProvider } from "./providers/openai";
import type { LLMProvider } from "./llm.types";

export function createLLM(): LLMProvider {
  const provider = process.env.LLM_PROVIDER;

  if (provider === "ollama") return createOllamaProvider();
  if (provider === "openai") return createOpenAIProvider();

  throw new Error("Invalid LLM_PROVIDER");
}
