import {GttsAdapter} from "../src/voice/adapters/gttsAdapter.ts";
import {speak} from "../src/speak.ts";
import {S3Adapter} from "../src/storage/adapters/S3Adapter.ts";

async function main() {
    const cache = new S3Adapter();
    const speaker = new GttsAdapter();

    await cache.delete("nl/-13.wav");

    const res = await speak("nl", "-13", cache, speaker);
    console.log('res', res);
}

main()