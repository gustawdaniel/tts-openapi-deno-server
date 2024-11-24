import gtts from "@ilawy/gtts";

import { GttsAdapter } from "../src/voice/adapters/gttsAdapter.ts";
const speechFile = "./demo-gtts.wav";

async function main() {
  // const speaker = new GttsAdapter();
  // const buffer: Uint8Array = await speaker.speak("Hello, World!", "en");
  const buffer: Uint8Array = await gtts("13", {
    language: "de",
  });
  await Deno.writeFile(speechFile, buffer);
}
main();
