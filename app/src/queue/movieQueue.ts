import { Queue, Worker } from "bullmq"
import { connection } from "@config/redis"
import { IMovie } from "@models/Movie"
import { embedText } from "@helper/embedder"

export const movieQueue = new Queue('movieQueue', { connection })

export const worker = new Worker<IMovie, Record<string, string>>('movieQueue', async job => {
    const titleVector = await embedText(job.data.title)
    const plotVector = await embedText(job.data.plot)
    console.log(`Processing job ${job.id} with data: `, job.data, 'title vector length: ', titleVector.length, 'plot vector length: ', plotVector.length);
    return { status: 'ok' };
}, { connection })

worker.on('completed', job => {
    console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job ? job.id : ''} failed:`, err);
});



export async function addMovieJob(movie: IMovie) {
    await movieQueue.add('addMovie', movie, {
        attempts: 3,
    });
    console.log(`Job added for movie: ${movie.title}`);
}
