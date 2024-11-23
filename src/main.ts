import { speakHttpHandler } from "./speakHttpHandler.ts";

const speakPattern = new URLPattern({ pathname: "/speak/:lang/:sentence" });

const corsHeaders = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
});


// import { serve } from "https://deno.land/std@0.188.0/http/mod.ts";

// serve(async (req: Request):Promise<Response> => {
//
// });

function getContentType(pathname: string): string | undefined {
  const ext = pathname.split(".").pop();
  switch (ext) {
    case "html": return "text/html";
    case "js": return "application/javascript";
    case "css": return "text/css";
    case "png": return "image/png";
    case "jpg": return "image/jpeg";
    case "svg": return "image/svg+xml";
    case "json": return "application/json";
    default: return undefined;
  }
}

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

        const response = await speakHttpHandler(
            speakMatch.pathname.groups.lang,
            speakMatch.pathname.groups.sentence,
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
      return new Response(file, {headers: { "content-type": "text/html" } });
    }
  },
} satisfies Deno.ServeDefaultExport;
