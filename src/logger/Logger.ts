import { AppError } from "../helpers/AppError.ts";

export abstract class Logger {
  abstract logSpeak(key: string, time: number): Promise<void>;

  abstract logCacheHit(key: string, time: number): Promise<void>;

  abstract logError(
    key: string,
    error: AppError,
    time: number,
  ): Promise<void>;

  abstract logProblem(
    key: string,
    problem: AppError,
    time: number,
  ): Promise<void>;
}
