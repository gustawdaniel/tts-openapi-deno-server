import { VoiceAdapter } from "../VoiceAdapter.ts";
import * as _ilawy_gtts from "@ilawy/gtts";
import { isLanguage, languages } from "../../helpers/languages.ts";

export class GttsAdapter extends VoiceAdapter {
  constructor() {
    super("gtts");
  }

  async speak(langString: string, sentence: string) {
    const lang = isLanguage(langString);

    const buffer: Uint8Array = await _ilawy_gtts.default(sentence, {
      language: lang,
    });

    return buffer;

    // const res = await fetch(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(sentence)}&tl=${lang}&client=tw-ob`);
    //
    // if(res.status === 200) {
    //     return new Uint8Array(await res.arrayBuffer());
    // } else {
    //     throw new Error(`[${res.status}] Failed to fetch audio from Google TTS: ${res.statusText}`);
    // }
  }
}
