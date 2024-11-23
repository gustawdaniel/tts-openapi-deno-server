import { Logger } from "../Logger.ts";
import { AppError } from "../../helpers/AppError.ts";

export class SilentLogger extends Logger {
    async logSpeak(_key: string, _time: number) {}
    async logCacheHit(_key: string, _time: number) {}
    async logError(_key: string, _error: AppError, _time: number) {}
    async logProblem(_key: string, _problem: AppError, _time: number) {}
}
