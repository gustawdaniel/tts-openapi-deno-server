import { languages } from "./languages.ts";

const cache = new Map<string, string>();

export async function detectLanguageWithLLM(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "pl";

  const cached = cache.get(trimmed);
  if (cached) return cached;

  const apiKey = Deno.env.get("DEEPSEEK_API_KEY") || Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    console.warn("No DEEPSEEK_API_KEY or OPENAI_API_KEY found, falling back to 'pl'");
    return "pl";
  }

  const isDeepseek = !!Deno.env.get("DEEPSEEK_API_KEY");
  const endpoint = isDeepseek
    ? "https://api.deepseek.com/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const model = isDeepseek ? "deepseek-chat" : "gpt-4o-mini";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: `You are a language identifier for educational sprint-reading exercises.
Return ONLY the 2-letter ISO 639-1 language code (e.g., pl, en, de, es, fr, ru, it, zh, ja, ar, nl).
Rules:
- If a sentence is mainly Polish asking about a foreign phrase (e.g. "Jak powiesz 'Dzień dobry' po niemiecku?"), return pl.
- If a sentence is in English (e.g. "We didn't have time."), return en.
- If in German (e.g. "Guten Tag"), return de.
- Return strictly the 2-letter code, nothing else.`,
          },
          {
            role: "user",
            content: trimmed,
          },
        ],
        max_tokens: 10,
        temperature: 0.0,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const raw = (data.choices?.[0]?.message?.content || "").trim().toLowerCase();
      const detected = raw.replace(/[^a-z]/g, "").slice(0, 2);
      if (languages.some((l) => l.value === detected)) {
        cache.set(trimmed, detected);
        console.log(`[LLM detectLanguage] "${trimmed}" -> ${detected}`);
        return detected;
      }
    } else {
      console.error(`LLM detectLanguage HTTP error ${res.status}:`, await res.text());
    }
  } catch (e) {
    console.error("LLM language detection error:", e);
  }

  return "pl";
}
