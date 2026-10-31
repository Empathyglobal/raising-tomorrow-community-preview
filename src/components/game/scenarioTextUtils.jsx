export function splitScenarioText(raw) {
  const text = String(raw || "").replace(/\r\n/g, "\n").trim();
  if (!text) return { body: "", prompt: "" };

  // First: common explicit trailing prompts on their own paragraph
  // Example: "...principal says X.\n\nWhat do you do?"
  const explicitMatch = text.match(/^(.*)\n\s*\n([^\n]{0,140}\?)\s*$/);
  if (explicitMatch) {
    const body = explicitMatch[1].trim();
    const last = explicitMatch[2].trim();

    // Treat short question as prompt if it looks like an actionable ask
    const looksPrompty =
      /^(what|how|which|where|when|why)\b/i.test(last) ||
      /your move/i.test(last) ||
      /what do you/i.test(last) ||
      /how do you/i.test(last) ||
      /what's your/i.test(last) ||
      /what would you/i.test(last);

    if (looksPrompty && body.length > 0) return { body, prompt: last };
  }

  // Second: exact common prompts (even without question mark)
  const commonTail = [
    "What do you do?",
    "What do you say?",
    "What do you choose?",
    "How do you respond?",
    "What's your response?",
    "How do you guide your child?"
  ];

  for (const tail of commonTail) {
    const re = new RegExp(`\\n\\s*\\n${tail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i");
    if (re.test(text)) {
      const body = text.replace(re, "").trim();
      return { body, prompt: tail };
    }
  }

  return { body: text, prompt: "" };
}