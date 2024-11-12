import { sleep } from "../src/helpers/sleep.ts";
import {languages} from "../src/helpers/languages.ts";
import {FileSystemAdapter} from "../src/storage/adapters/FileSystemAdapter.ts";
import { GttsAdapter } from "../src/voice/adapters/gttsAdapter.ts";

// 100 requests per hour mens sleep time of 36 seconds
const sleepTime = 36 * 1000;

const cache = new FileSystemAdapter();
const speaker = new GttsAdapter();

for(let i = -15; i <= 15; i++) {
    for (const lang of languages.map(l => l.value)) {
        console.log(i, lang);
        await Deno.mkdir(`./static/voice/${lang}`, {recursive: true});

        const key = `${lang}/${i}.wav`;

        const exists = await cache.get(key)

        if(!exists) {
            await sleep(sleepTime);
            const uIntArr = await speaker.speak(i.toString(), lang);
            await cache.set(key, uIntArr);

            console.log("saved", `./static/voice/${key}`);
        } else {
            console.log("cache hit")
        }
    }
}

