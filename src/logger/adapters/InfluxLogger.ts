import { Logger } from "../Logger.ts";
import { AppError } from "../../helpers/AppError.ts";
import { InfluxDBClient, Point } from "npm:@influxdata/influxdb3-client";
import { config } from "https://deno.land/x/dotenv/mod.ts";

function decomposeKey(
  key: string,
): { lang: string; text: string; voice: string } {
  const [voice, lang, text] = key.split("/");
  return { lang, voice, text: text.replace(/.wav$/, "") };
}

export class InfluxLogger extends Logger {
  private client: InfluxDBClient;

  close() {
    this.client.close();
  }

  constructor() {
    super();

    const env = config();

    const token = env.INFLUXDB_TOKEN;
    const host = env.INFLUXDB_HOST;
    const database = env.INFLUXDB_DATABASE;

    console.log("token", token);

    this.client = new InfluxDBClient({
      host,
      token,
      database,
    });
  }

  async logSpeak(key: string, time: number) {
    console.log(`Logging speak to InfluxDB: ${key}`);
    const { lang, text, voice } = decomposeKey(key);
    await this.client.write(
      Point.measurement("action")
        .setTag("type", "speak")
        .setTag("lang", lang)
        .setTag("text", text)
        .setTag("voice", voice)
        .setFloatField("time_taken_ms", time)
        .setField("key", key)
        .setTimestamp(new Date()),
    );
  }

  async logCacheHit(key: string, time: number) {
    console.log(`Logging cache hit to InfluxDB: ${key}`);
    const { lang, text, voice } = decomposeKey(key);
    const res = await this.client.write(
      Point.measurement("action")
        .setTag("type", "cache_hit")
        .setTag("lang", lang)
        .setTag("text", text)
        .setTag("voice", voice)
        .setFloatField("time_taken_ms", time)
        .setField("key", key)
        .setTimestamp(new Date()),
    );
    console.log("saved influx", res);
  }

  async logError(key: string, error: AppError, time: number) {
    console.error(`Logging error to InfluxDB: ${key}`);
    const { lang, text, voice } = decomposeKey(key);
    await this.client.write(
      Point.measurement("error")
        .setFloatField("time_taken_ms", time)
        .setField("key", key)
        .setTag("lang", lang)
        .setTag("text", text)
        .setTag("voice", voice)
        .setField("message", error.message)
        .setField("status", error.status)
        .setTimestamp(new Date()),
    );
  }

  async logProblem(key: string, problem: AppError, time: number) {
    console.error(`Logging problem to InfluxDB: ${key}`);
    const { lang, text, voice } = decomposeKey(key);
    await this.client.write(
      Point.measurement("problem")
        .setFloatField("time_taken_ms", time)
        .setField("key", key)
        .setTag("lang", lang)
        .setTag("text", text)
        .setTag("voice", voice)
        .setField("message", problem.message)
        .setField("status", problem.status)
        .setTimestamp(new Date()),
    );
  }
}
