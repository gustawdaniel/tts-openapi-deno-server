import {VoiceAdapter} from "./voice/VoiceAdapter.ts";
import {StorageAdapter} from "./storage/StorageAdapter.ts";

export async function speak(lang: string, sentence: string, cache: StorageAdapter, speaker: VoiceAdapter): Promise<Response> {
    const key = `${lang}/${sentence}.wav`

    const exists = await cache.get(key);

    if(exists) {
        return exists;
    }

    try {
        const res = await speaker.speak(lang, sentence);
        return await cache.set(key, res);
    } catch(e) {
        console.error(e);

        if(e instanceof Error) {
            const status = e.message.startsWith("[") ? parseInt(e.message.substring(1, e.message.indexOf("]"))) : 500;
            return new Response(e.message, {status});
        } else {
            return new Response(null, {status: 500});
        }
    }


}