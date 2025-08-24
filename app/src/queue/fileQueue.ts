import { Queue, Worker, Job } from "bullmq"
import { connection } from "@config/redis"
import { extractMoviesFromCsv } from "@helper/fileHelper.js";
import { addMovieJob } from "./movieQueue.js";
import { Movie } from "@models/Movie"

const queueName = 'fileQueue';

export const fileQueue = new Queue(queueName, { connection })

const worker = new Worker<string, Record<string, string>>(queueName, async (job: Job) => {
    const movies = await extractMoviesFromCsv(job.data)
    await job.updateProgress(movies);
    movies.forEach(async (movie: Movie) => {
        await addMovieJob(movie)
    })
    return { status: 'ok' }
}, { connection })

worker.on('failed', (job: Job | undefined, error: Error, prev: string) => {
    console.log("Error in fileQueue: ", error)
});

worker.on('completed', (job: Job, returnvalue: any) => {
    console.log("FileQueue completed")
});


export async function addFileJob(filePath: string) {
    await fileQueue.add('addFile', filePath, {
        attempts: 3,
    });
}
