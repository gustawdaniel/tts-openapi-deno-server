import { languages } from "../helpers/languages.ts";

export function validateInput(lang: string, text: string): string | undefined {
  if (languages.find((l) => l.value === lang) === undefined) {
    return `Language not supported, get one of: ${
      languages.map((l) => l.value).join(", ")
    }.`;
  }

  if (text.length > 7) {
    return `Text too long, max 5 characters.`;
  }

  const allowedText = /^[0-9+\- ]*$/;

  if (!allowedText.test(text)) {
    return `Text must contain only numbers, +, - or spaces.`;
  }
}
