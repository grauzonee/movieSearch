import { embedText } from '@helper/embedder.js';
import { client } from "@config/elastic"
import { Movie } from "@models/Movie"

const shouldClasses = (queryVector: number[]) => {
    return [
        {
            knn: {
                field: "plot_vector",
                query_vector: queryVector,
                num_candidates: 100,
                boost: 3
            }
        },
        {
            knn: {
                field: "plot_vector",
                query_vector: queryVector,
                num_candidates: 100,
                boost: 2
            }
        }
    ]

}
export async function searchMovie(q: string): Promise<Movie> {
    const embeddings = await embedText(q);
    const queryVector = Array.from(embeddings)
    const result = await client.search({
        index: 'movies',
        _source: ['title', 'plot', 'genres', 'year'],
        body: {
            size: 5,
            query: {
                function_score: {
                    query: {
                        bool: {
                            should: shouldClasses(queryVector),
                            minimum_should_match: 1
                        }
                    },
                    random_score: { seed: Date.now(), field: "_seq_no" },
                    boost_mode: "sum",
                    score_mode: "sum"
                }
            }
        }
    })
    return result.hits.hits.map((hit: Movie) => ({
        id: hit._id,
        score: hit._score,
        ...hit._source,
    }));
}
