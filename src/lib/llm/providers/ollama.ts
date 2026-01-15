import type { LLMProvider, ChatMessage } from "../llm.types";
import { env } from "../../../config/env";
import { SYSTEM_PROMPT } from "../prompts/system.prompt";

type OllamaResponse = {
  message: {
    content: string;
  };
};

export function createOllamaProvider(): LLMProvider {
  const baseUrl = env.OLLAMA_BASE_URL;
  const llmModel = env.LLM_MODEL;

  async function chat(messages: ChatMessage[]): Promise<string> {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: llmModel,
        messages,
        stream: false,
      })
    });

    if (!res.ok) {
      throw new Error("Ollama request failed");
    }

    const data = (await res.json()) as OllamaResponse;
    return data.message.content;
  }

  async function summarize(text: string): Promise<string> {
    return chat([
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      { role: "user", content: text }
    ]);
  }
  
  async function analyze(text: string) {
  }
  
  async function compare(text: string) {
  }

  return { chat, summarize };
}
