export abstract class VoiceAdapter {
  abstract speak(lang: string, sentence: string): Promise<Uint8Array>;
}
