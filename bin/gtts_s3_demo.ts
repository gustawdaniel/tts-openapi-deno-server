import { GttsAdapter } from "../src/voice/adapters/gttsAdapter.ts";
import { speak } from "../src/speak.ts";
import { S3Adapter } from "../src/storage/adapters/S3Adapter.ts";
import { Key } from "../src/helpers/Key.ts";

async function main() {
  const cache = new S3Adapter();
  const speaker = new GttsAdapter();

  await cache.delete(Key.compose("gtts", "nl", "-13"));

  const res = await speak("nl", "-13", cache, speaker);
  console.log("res", res);
}

main();
