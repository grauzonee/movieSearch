import { Queue, Worker, Job } from "bullmq"
import { connection } from "@config/redis"
import { Movie } from "@models/Movie"
import { embedText } from "@helper/embedder"
import { client } from "@config/elastic"
import crypto from "crypto"
import { logger } from "@helper/logger.js"

const queueName = 'movieQueue'

function generateMovieId(title: string, year: number): string {
    return crypto
        .createHash("md5")
        .update(title.trim().toLowerCase() + year)
        .digest("hex")
}

export const movieQueue = new Queue(queueName, { connection })

export const worker = new Worker<Movie & { index: number, total: number }, Record<string, string>>(queueName, async (job: Job) => {
    const title_vector = await embedText(job.data.title)
    const plot_vector = await embedText(job.data.plot)
    const movieToInsert = {
        ...job.data,
        title_vector,
        plot_vector
    }
    try {
        await client.index({
            index: 'movies',
            id: generateMovieId(job.data.title, job.data.year),
            body: movieToInsert
        })
        await client.indices.refresh({ index: 'movies' })
        logger.info(`Movie ${job.data.index}/${job.data.total} processed: "${job.data.title}"`);
    } catch (error) {
        logger.error("Error inserting movie to ES", error);
    }
    return { status: 'ok' };
}, { connection })

export async function addMovieJob(movie: Movie, index: number, total: number) {
    await movieQueue.add('addMovie', { ...movie, index, total }, {
        attempts: 3,
    });
}
