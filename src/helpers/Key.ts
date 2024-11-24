export class Key {
  static compose(voice: string, lang: string, text: string): string {
    return `${voice}/${lang}/${text.replaceAll(" ", "_")}.wav`;
  }

  static decompose(
    key: string,
  ): { lang: string; text: string; voice: string } {
    const [voice, lang, text] = key.split("/");
    return {
      lang,
      voice,
      text: text.replace(/.wav$/, "").replaceAll("_", " "),
    };
  }
}
