export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LLMProvider = {
  chat(messages: ChatMessage[]): Promise<string>;
  summarize(text: string): Promise<string>;
  patternCheck(content: string): Promise<string>;
}