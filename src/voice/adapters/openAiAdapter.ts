import { VoiceAdapter } from "../VoiceAdapter.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import OpenAI from "npm:openai";
import assert from "node:assert";

export class OpenAiAdapter extends VoiceAdapter {
  private readonly openai: OpenAI;

  constructor() {
    super("openai");

    const env = config();

    if (env.OPENAI_API_KEY && !Deno.env.get("OPENAI_API_KEY")) {
      Deno.env.set("OPENAI_API_KEY", env.OPENAI_API_KEY);
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");

    assert.ok(apiKey, "OPENAI_API_KEY is required");

    this.openai = new OpenAI({
      apiKey,
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
