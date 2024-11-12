import {validateInput} from "./validators/validateInput.ts";
import {GttsAdapter} from "./voice/adapters/gttsAdapter.ts";
import {S3Adapter} from "./storage/adapters/S3Adapter.ts";
import {speak} from "./speak.ts";

const cache = new S3Adapter();
const speaker = new GttsAdapter();

export async function speakHttpHandler(lang: string, text: string): Promise<Response> {
    const validationError = validateInput(lang, text);

    if(validationError) {
        return new Response(validationError, { status: 400 });
    }

    return await speak(lang, text, cache, speaker);
}