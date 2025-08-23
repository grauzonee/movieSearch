import { Queue, Worker } from "bullmq"
import { connection } from "@config/redis"
import { IMovie } from "@models/Movie"
import { embedText } from "@helper/embedder"
import { client } from "@config/elastic"

export const movieQueue = new Queue('movieQueue', { connection })

export const worker = new Worker<IMovie, Record<string, string>>('movieQueue', async job => {
    const title_vector = await embedText(job.data.title)
    const plot_vector = await embedText(job.data.plot)
    const postToInsert = {
        ...job.data,
        title_vector,
        plot_vector
    }
    try {
        await client.index({
            index: 'movies',
            body: postToInsert
        })
        await client.indices.refresh({ index: 'movies' })
    } catch (error) {
        console.log("Error inserting movie to ES", error);
    }
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
