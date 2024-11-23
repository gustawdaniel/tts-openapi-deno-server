export abstract class VoiceAdapter {
  public code: string;

  protected constructor(code: string) {
    this.code = code;
  }

  abstract speak(lang: string, sentence: string): Promise<Uint8Array>;
}
