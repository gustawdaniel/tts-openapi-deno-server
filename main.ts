import { serveDir } from "@std/http";
import { speakHttpHandler } from "./src/speakHttpHandler.ts";

const userPagePattern = new URLPattern({ pathname: "/users/:id" });
const staticPathPattern = new URLPattern({ pathname: "/static/*" });
const speakPattern = new URLPattern({ pathname: "/speak/:lang/:sentence" });

const corsHeaders = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
});

export default {
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response("Check /static/voice/pl/0.wav");
    }

    const userPageMatch = userPagePattern.exec(url);
    if (userPageMatch) {
      return new Response(userPageMatch.pathname.groups.id);
    }

    const speakMatch = speakPattern.exec(url);
    if (
      speakMatch && speakMatch.pathname.groups.lang &&
      speakMatch.pathname.groups.sentence
    ) {
      if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      const response = await speakHttpHandler(
        speakMatch.pathname.groups.lang,
        speakMatch.pathname.groups.sentence,
      );
      // Add CORS headers to the existing response
      corsHeaders.forEach((value, key) => response.headers.set(key, value));
      return response;
    }

    if (staticPathPattern.test(url)) {
      return serveDir(req);
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies Deno.ServeDefaultExport;
