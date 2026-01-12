export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface LLMProvider {
  chat(messages: ChatMessage[]): Promise<string>;
  summarize(text: string): Promise<string>;
}