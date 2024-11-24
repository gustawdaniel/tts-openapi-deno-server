import { validateInput } from "./validators/validateInput.ts";
import { GttsAdapter } from "./voice/adapters/gttsAdapter.ts";
import { S3Adapter } from "./storage/adapters/S3Adapter.ts";
import { speak } from "./speak.ts";
import { InfluxLogger } from "./logger/adapters/InfluxLogger.ts";

const cache = new S3Adapter();
const speakers = [new GttsAdapter()];
const logger = new InfluxLogger();

export async function speakHttpHandler(
  lang: string,
  text: string,
): Promise<Response> {
  const validationError = validateInput(lang, text);

  if (validationError) {
    return new Response(validationError, { status: 400 });
  }

  try {
    return await speak(lang, text, cache, speakers, logger);
  } catch (e) {
    console.error(e);
    return new Response(null, { status: 500 });
  }
}
