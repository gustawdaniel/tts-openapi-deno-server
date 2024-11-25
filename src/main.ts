import { speakHttpHandler } from "./speakHttpHandler.ts";
import {Language, languages} from "./helpers/languages.ts";

const speakPattern = new URLPattern({ pathname: "/speak/:lang/:sentence" });

const corsHeaders = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
});

function getContentType(pathname: string): string | undefined {
  const ext = pathname.split(".").pop();
  switch (ext) {
    case "html":
      return "text/html";
    case "js":
      return "application/javascript";
    case "css":
      return "text/css";
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";
    case "svg":
      return "image/svg+xml";
    case "json":
      return "application/json";
    default:
      return undefined;
  }
}

function getTriangularRandom(min: number, max: number, mode: number): number {
  const u = Math.random(); // Generate a uniform random number between 0 and 1
  if (u < (mode - min) / (max - min)) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
}

let timeout = 1000 * 1;
let randomNumber = 23;
let randomLang: Language = 'en';

function callSpeakRandomNumber() {
  setTimeout(async () => {
    randomNumber = Math.round(getTriangularRandom(-100,100, 0));
    timeout = 1000 * Math.round(getTriangularRandom(60, 300, 120));
    randomLang = languages[Math.floor(Math.random() * languages.length)].value;
    const text = randomNumber < 0 ? `- ${Math.abs(randomNumber)}` : `+ ${randomNumber}`;

    console.log('cron', timeout, randomLang, randomNumber, text);
    await speakHttpHandler(
        randomLang,
        text,
    );

    // await speakHttpHandler("en", `Random number is ${randomNumber}`);
    callSpeakRandomNumber();
  }, timeout);
}

callSpeakRandomNumber();

setTimeout(() => {
  timeout = 1000 * 60 * 60;
}, 1000 * 60 * 60);

export default {
  async fetch(req) {
    const url = new URL(req.url);

    try {
      const speakMatch = speakPattern.exec(url);

      if (
        speakMatch && speakMatch.pathname.groups.lang &&
        speakMatch.pathname.groups.sentence
      ) {
        if (req.method === "OPTIONS") {
          return new Response(null, { status: 204, headers: corsHeaders });
        }

        const text = decodeURIComponent(speakMatch.pathname.groups.sentence);

        const response = await speakHttpHandler(
          speakMatch.pathname.groups.lang,
          text,
        );

        // Add CORS headers to the existing response
        corsHeaders.forEach((value, key) => response.headers.set(key, value));
        return response;
      }

      const filePath = `${Deno.cwd()}/static${url.pathname}`;
      const file = Deno.readFileSync(filePath);
      const contentType = getContentType(url.pathname);
      return new Response(file, {
        headers: { "content-type": contentType || "application/octet-stream" },
      });
    } catch {
      const file = Deno.readFileSync(`${Deno.cwd()}/static/index.html`);
      return new Response(file, { headers: { "content-type": "text/html" } });
    }
  },
} satisfies Deno.ServeDefaultExport;
