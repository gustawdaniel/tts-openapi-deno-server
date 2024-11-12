export type Language =
  | "pl"
  | "en"
  | "de"
  | "fr"
  | "it"
  | "es"
  | "ru"
  | "ja"
  | "zh"
  // | "nb"
  | "ar"
  | "nl";

export const languages: { text: string; value: Language }[] = [
  { text: "Polish", value: "pl" },
  { text: "English", value: "en" },
  { text: "German", value: "de" },
  { text: "French", value: "fr" },
  { text: "Italian", value: "it" },
  { text: "Spanish", value: "es" },
  { text: "Russian", value: "ru" },
  { text: "Japanese", value: "ja" },
  { text: "Chinese", value: "zh" },
  // { text: "Norwegian", value: "nb" },
  { text: "Arabic", value: "ar" },
  { text: "Dutch", value: "nl" },
];

export function isLanguage(lang: string): Language {
  const found = languages.find((l) => l.value === lang)?.value;
  if (!found) {
    throw new Error(
      `Language not supported, get one of: ${
        languages.map((l) => l.value).join(", ")
      }.`,
    );
  }

  return found;
}
