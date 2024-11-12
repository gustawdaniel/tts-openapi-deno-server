import {VoiceAdapter} from "./voice/VoiceAdapter.ts";
import {StorageAdapter} from "./storage/StorageAdapter.ts";

export async function speak(lang: string, sentence: string, cache: StorageAdapter, speaker: VoiceAdapter): Promise<Response> {
    const key = `${lang}/${sentence}.wav`

    const exists = await cache.get(key);

    if(exists) {
        return exists;
    }

    const res = await speaker.speak(lang, sentence);

    return await cache.set(key, res);
}