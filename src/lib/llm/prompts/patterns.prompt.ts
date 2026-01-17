export function patternPrompt(formattedEntries: string) {
  return `
Here are several recent journal entries.

---
${formattedEntries}
---

Tasks:
1. Identify topics or situations that appear repeatedly
2. Identify repeated emotional language
3. Describe patterns using tentative phrasing only
`;
}