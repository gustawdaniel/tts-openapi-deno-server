import {StorageAdapter} from "../StorageAdapter.ts";
import { config } from 'https://deno.land/x/dotenv/mod.ts';
import { S3, S3Bucket } from "https://deno.land/x/s3@0.5.0/mod.ts";

export class S3Adapter extends StorageAdapter {
    private readonly bucket: S3Bucket;
    private readonly dir: string;
    private readonly base: string;

    constructor() {
        super();

        const env = config();

        Deno.env.set("S3_ACCESS_KEY_ID", env.S3_ACCESS_KEY_ID)
        Deno.env.set("S3_SECRET_ACCESS_KEY", env.S3_SECRET_ACCESS_KEY)
        Deno.env.set("S3_REGION", env.S3_REGION)
        Deno.env.set("S3_BUCKET_NAME", env.S3_BUCKET_NAME)
        Deno.env.set("S3_DIR", env.S3_DIR)
        Deno.env.set("S3_ENDPOINT_URL", env.S3_ENDPOINT_URL.startsWith('https://') ? env.S3_ENDPOINT_URL : `https://${env.S3_ENDPOINT_URL}`)

        console.log('r1', env.S3_REGION);
        console.log('r2', Deno.env.get("S3_REGION")!);

        const s3 = new S3({
            accessKeyID: Deno.env.get("S3_ACCESS_KEY_ID")!,
            secretKey: Deno.env.get("S3_SECRET_ACCESS_KEY")!,
            region: Deno.env.get("S3_REGION")!,
            endpointURL: Deno.env.get("S3_ENDPOINT_URL"),
        });

        this.bucket = s3.getBucket(Deno.env.get("S3_BUCKET_NAME")!);
        this.dir = Deno.env.get("S3_DIR")!;
        this.base = `https://${Deno.env.get('S3_BUCKET_NAME')}.${Deno.env.get("S3_ENDPOINT_URL")!.replace(/^https?:\/\//, '')}`;
    }

    private s3Key(key: string): string {
        return `${this.dir}/${key}`;
    }

    async get(appKey: string): Promise<Response | undefined> {
        const key = this.s3Key(appKey);
        const exists = await this.bucket.getObject(key)
        console.log(exists);

        if (exists) {
            return new Response(null, { status: 302, headers: { "Location": `${this.base}/${key}` } });
        }
    }

    async set(appKey: string, value: Uint8Array): Promise<Response> {
        const key = this.s3Key(appKey);

        await this.bucket.putObject(key, value, {
            acl: "public-read",
            contentType: "audio/wav", // Specify the content type if known
        });

        return new Response(null, { status: 302, headers: { "Location": `${this.base}/${key}` } });
    }

    async delete(appKey: string): Promise<void> {
        const key = this.s3Key(appKey);
        await this.bucket.deleteObject(key);
    }
}