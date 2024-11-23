import { VoiceAdapter } from "./voice/VoiceAdapter.ts";
import { StorageAdapter } from "./storage/StorageAdapter.ts";
import {AppError} from "./helpers/AppError.ts";
import {Logger} from "./logger/Logger.ts";



function getError(e: unknown): AppError {
    if (e instanceof Error) {
        const status = e.message.startsWith("[")
            ? parseInt(
                e.message.substring(1, e.message.indexOf("]")),
            )
            : 500;

        return {
            message: e.message,
            status,
        };
    } else {
        return { status: 500, message: "Internal Server Error" };
    }
}

export async function speak(
    lang: string,
    sentence: string,
    cache: StorageAdapter,
    speakers: VoiceAdapter[],
    logger: Logger
): Promise<Response> {
    const start = Date.now();
    const problems: AppError[] = [];

    for (const speaker of speakers) {
        const key = `${speaker.code}/${lang}/${sentence}.wav`;
        const exists = await cache.get(key);

        if (exists) {
            logger.logCacheHit(key, Date.now() - start).catch(console.error);
            return exists;
        }

        try {
            const res = await speaker.speak(lang, sentence);
            logger.logSpeak(key, Date.now() - start).catch(console.error);
            return await cache.set(key, res);
        } catch (e) {
            console.error(e);
            const appError = getError(e);
            problems.push(appError);
            logger.logProblem(key, appError, Date.now() - start).catch(console.error);
        }
    }

    logger.logError(
        `all/${lang}/${sentence}.wav`,
        {
            message: JSON.stringify(problems),
            status: problems[0].status
        },
        Date.now() - start,
    ).catch(console.error);
    return new Response(JSON.stringify(problems), {
        status: problems[0].status,
    });
}
