import { validateInput } from "./validators/validateInput.ts";
import { GttsAdapter } from "./voice/adapters/gttsAdapter.ts";
import { S3Adapter } from "./storage/adapters/S3Adapter.ts";
import { speak } from "./speak.ts";
import { InfluxLogger } from "./logger/adapters/InfluxLogger.ts";
import { detectLanguageWithLLM } from "./helpers/detectLanguage.ts";
import * as Sentry from "npm:@sentry/deno";

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

  if (lang === "auto" || !lang) {
    lang = await detectLanguageWithLLM(text);
  }

  try {
    return await speak(lang, text, cache, speakers, logger);
  } catch (e) {
    console.error(e);
    Sentry.captureException(e, {
      tags: { module: "tts", lang },
      extra: { text },
    });
    return new Response(null, { status: 500 });
  }
}
