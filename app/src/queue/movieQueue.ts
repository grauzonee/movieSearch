import { Queue, Worker } from "bullmq"
import { connection } from "@config/redis"
import { IMovie } from "@models/Movie"

export const movieQueue = new Queue('movieQueue', { connection })

export const worker = new Worker('movieQueue', async job => {
    console.log(`Processing job ${job.id} with data: `, job.data);
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
