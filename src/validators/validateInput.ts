import { languages } from "../helpers/languages.ts";

export function validateInput(lang: string, text: string): string | undefined {
    if (languages.find((l) => l.value === lang) === undefined) {
        return `Language not supported, get one of: ${
            languages.map((l) => l.value).join(", ")
        }.`;
    }

    if (text.length > 5) {
        return `Text too long, max 5 characters.`;
    }

    if (Number.isNaN(Number(text))) {
        return `Text must be a number.`;
    }
}
