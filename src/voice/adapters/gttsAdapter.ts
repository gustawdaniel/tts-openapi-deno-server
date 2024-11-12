import { VoiceAdapter } from "../VoiceAdapter.ts";

export class GttsAdapter extends VoiceAdapter {
    async speak(lang: string, sentence: string) {
        const res = await fetch(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(sentence)}&tl=${lang}&client=tw-ob`);
        return new Uint8Array(await res.arrayBuffer());
    }
}