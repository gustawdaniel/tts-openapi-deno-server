import { fileExists } from "../../helpers/fileExists.ts";
import {StorageAdapter} from "../StorageAdapter.ts";

export class FileSystemAdapter extends StorageAdapter {
    async get(key: string): Promise<Response | undefined> {
        const path = `./static/voice/${key}`;
        if(await fileExists(path)) {
            return new Response(null, { status: 302, headers: { "Location": `/static/voice/${key}` } });
        }
    }

    async set(key: string, value: Uint8Array): Promise<Response> {
        const path = `./static/voice/${key}`;
        await Deno.writeFile(path, value);
        return new Response(null, { status: 302, headers: { "Location": `/static/voice/${key}` } });
    }
}