import { Logger } from "../Logger.ts";
import { AppError } from "../../helpers/AppError.ts";

export class ConsoleLogger extends Logger {
  logSpeak(key: string, time: number): Promise<void> {
    console.log(`Logging speak of: ${key}`, { time });
    return Promise.resolve();
  }

  logCacheHit(key: string, time: number): Promise<void> {
    console.log(`Logging cache hit of: ${key}`, { time });
    return Promise.resolve();
  }

  logError(key: string, error: AppError, time: number): Promise<void> {
    console.error(`Logging error of: ${key}`, { time, error });
    return Promise.resolve();
  }

  logProblem(key: string, problem: AppError, time: number): Promise<void> {
    console.error(`Logging problem of: ${key}`, { time, problem });
    return Promise.resolve();
  }
}
