import { VoiceAdapter } from "../VoiceAdapter.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import OpenAI from "npm:openai";

export class OpenAiAdapter extends VoiceAdapter {
  private readonly openai: OpenAI;

  constructor() {
    super();

    const env = config();

    this.openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  async speak(text: string, lang: string): Promise<Uint8Array> {
    const mp3 = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });
    console.log(`Language: ${lang} is ignored.`);
    return new Uint8Array(await mp3.arrayBuffer());
  }
}
