import { Queue, Worker, Job } from "bullmq"
import { connection } from "@config/redis"
import { extractMoviesFromCsv } from "@helper/fileHelper.js";
import { addMovieJob } from "./movieQueue.js";
import { Movie } from "@models/Movie"

const queueName = 'fileQueue';

export const fileQueue = new Queue(queueName, { connection })

new Worker<string, Record<string, string>>(queueName, async (job: Job) => {
    const movies = await extractMoviesFromCsv(job.data)
    await job.updateProgress(movies);
    movies.forEach(async (movie: Movie) => {
        await addMovieJob(movie)
    })
    return { status: 'ok' }
}, { connection })

export async function addFileJob(filePath: string) {
    await fileQueue.add('addFile', filePath, {
        attempts: 3,
    });
}
