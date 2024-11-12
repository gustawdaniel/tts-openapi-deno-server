import { config } from 'https://deno.land/x/dotenv/mod.ts';
const env = config();

import OpenAI from 'npm:openai';
const openai = new OpenAI({
    // baseURL: 'http://localhost:11434/v1',
    // apiKey: 'ollama'
    apiKey: env.OPENAI_API_KEY,
});

const speechFile = "./speech.mp3";

async function main() {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: "23",
    });
    console.log(speechFile);
    const buffer = new Uint8Array(await mp3.arrayBuffer());
    await Deno.writeFile(speechFile, buffer);
}
main();