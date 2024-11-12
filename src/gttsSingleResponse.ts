import * as _ilawy_gtts from "@ilawy/gtts";
import { fileExists } from "./fileExists.ts";
import {languages} from "./languages.ts";

export async function gttsSingleResponse(lang: string, text: string) {
    if(languages.find(l => l.value === lang) === undefined) {
        return new Response(`Language not supported, get one of: ${languages.map(l => l.value).join(', ')}.`, { status: 400 });
    }

    const path = `./static/voice/${lang}/${text}.wav`;
    if(!await fileExists(path)) {
        // await sleep(sleepTime);
        await _ilawy_gtts.save(path, text.toString(), {language: lang});
        console.log("saved", path);
    } else {
        console.log("cache hit")
    }

    return new Response(null, { status: 302, headers: { "Location": `/static/voice/${lang}/${text}.wav` } });
}