import { embedText } from '@helper/embedder.js';
import { client } from "@config/elastic"
import { Movie } from "@models/Movie"

export async function searchMovie(q: string): Promise<Movie> {
    const embeddings = await embedText(q);
    const queryVector = Array.from(embeddings)
    const result = await client.search({
        index: 'movies',
        _source: ['title', 'plot', 'genres', 'year'],
        body: {
            size: 5,
            knn: {
                field: "plot_vector",
                query_vector: queryVector,
                k: 5,
                num_candidates: 100,
            },
        }
    })
    return result.hits.hits.map((hit: Movie) => ({
        id: hit._id,
        score: hit._score,
        ...hit._source,
    }));
}
