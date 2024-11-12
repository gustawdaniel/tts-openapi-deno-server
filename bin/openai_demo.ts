import { OpenAiAdapter } from "../src/voice/adapters/openAiAdapter.ts";
const speechFile = "./demo-openai.mp3";

async function main() {
  const speaker = new OpenAiAdapter();
  const buffer: Uint8Array = await speaker.speak("Hello, World!", "en");
  await Deno.writeFile(speechFile, buffer);
}
main();
