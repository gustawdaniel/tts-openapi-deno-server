import { Logger } from "../Logger.ts";
import { AppError } from "../../helpers/AppError.ts";
import { InfluxDBClient, Point } from "npm:@influxdata/influxdb3-client";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import assert from "node:assert";
import { Key } from "../../helpers/Key.ts";

export class InfluxLogger extends Logger {
  private client: InfluxDBClient;

  close() {
    this.client.close();
  }

  constructor() {
    super();

    const env = config();

    if (env.INFLUXDB_TOKEN && !Deno.env.get("INFLUXDB_TOKEN")) {
      Deno.env.set("INFLUXDB_TOKEN", env.INFLUXDB_TOKEN);
    }
    if (env.INFLUXDB_HOST && !Deno.env.get("INFLUXDB_HOST")) {
      Deno.env.set("INFLUXDB_HOST", env.INFLUXDB_HOST);
    }
    if (env.INFLUXDB_DATABASE && !Deno.env.get("INFLUXDB_DATABASE")) {
      Deno.env.set("INFLUXDB_DATABASE", env.INFLUXDB_DATABASE);
    }

    const token = Deno.env.get("INFLUXDB_TOKEN");
    const host = Deno.env.get("INFLUXDB_HOST");
    const database = Deno.env.get("INFLUXDB_DATABASE");

    assert.ok(token, "INFLUXDB_TOKEN is required");
    assert.ok(host, "INFLUXDB_HOST is required");
    assert.ok(database, "INFLUXDB_DATABASE is required");

    this.client = new InfluxDBClient({
      host,
      token,
      database,
    });
  }

  async logSpeak(key: string, time: number) {
    console.log(`Logging speak to InfluxDB: ${key}`);
    const { lang, text, voice } = Key.decompose(key);
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
    const { lang, text, voice } = Key.decompose(key);
    await this.client.write(
      Point.measurement("action")
        .setTag("type", "cache_hit")
        .setTag("lang", lang)
        .setTag("text", text)
        .setTag("voice", voice)
        .setFloatField("time_taken_ms", time)
        .setField("key", key)
        .setTimestamp(new Date()),
    );
  }

  async logError(key: string, error: AppError, time: number) {
    console.error(`Logging error to InfluxDB: ${key}`);
    const { lang, text, voice } = Key.decompose(key);
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
    const { lang, text, voice } = Key.decompose(key);
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
