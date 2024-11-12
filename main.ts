import { serveDir } from "@std/http";
import {gttsSingleResponse} from "./src/gttsSingleResponse.ts";

const userPagePattern = new URLPattern({ pathname: "/users/:id" });
const staticPathPattern = new URLPattern({ pathname: "/static/*" });
const speakPattern = new URLPattern({ pathname: "/speak/:lang/:sentence" });

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
    if (speakMatch && speakMatch.pathname.groups.lang && speakMatch.pathname.groups.sentence) {
      return await gttsSingleResponse(speakMatch.pathname.groups.lang, speakMatch.pathname.groups.sentence);
    }

    if (staticPathPattern.test(url)) {
      return serveDir(req);
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies Deno.ServeDefaultExport;
