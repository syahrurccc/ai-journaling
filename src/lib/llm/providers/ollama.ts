import type { LLMProvider, ChatMessage } from "../llm.types";
import { env } from "../../../config/env";

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
        content: "Summarize the following journal entry in 2–3 sentences."
      },
      { role: "user", content: text }
    ]);
  }

  return { chat, summarize };
}
