import { languages } from "../helpers/languages.ts";

export function validateInput(lang: string, text: string): string | undefined {
  if (lang !== "auto" && languages.find((l) => l.value === lang) === undefined) {
    return `Language not supported, get one of: ${
      languages.map((l) => l.value).join(", ")
    }, auto.`;
  }

  if (text.length > 1000) {
    return `Text too long, max 1000 characters.`;
  }
}
