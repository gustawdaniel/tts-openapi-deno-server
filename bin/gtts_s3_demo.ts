import {GttsAdapter} from "../src/voice/adapters/gttsAdapter.ts";
import {speak} from "../src/speak.ts";
import {S3Adapter} from "../src/storage/adapters/S3Adapter.ts";

async function main() {
    const cache = new S3Adapter();
    const speaker = new GttsAdapter();

    const res = await speak("pl", "11", cache, speaker);
    console.log('res', res);
}

main()