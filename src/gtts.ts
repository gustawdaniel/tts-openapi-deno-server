import * as _ilawy_gtts from "@ilawy/gtts";
import { sleep } from "./sleep.ts";
import {fileExists} from "./fileExists.ts";
import {languages} from "./languages.ts";

// 100 requests per hour mens sleep time of 36 seconds
const sleepTime = 36 * 1000;

for(let i = -10; i <= 10; i++) {
    for (const lang of languages.map(l => l.value)) {
        console.log(i, lang);
        await Deno.mkdir(`./static/voice/${lang}`, {recursive: true});

        const path = `./static/voice/${lang}/${i}.wav`;
        if(!await fileExists(path)) {
            await sleep(sleepTime);
            await _ilawy_gtts.save(path, i.toString(), {language: lang});
            console.log("saved", path);
        } else {
            console.log("cache hit")
        }
    }
}

