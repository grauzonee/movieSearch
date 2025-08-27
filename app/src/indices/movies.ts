import { client } from "@config/elastic"
import { logger } from "@helper/logger.js";

export async function createMovieIndex() {
    const indexExists = await client.indices.exists({ index: "movies" });

    if (!indexExists) {

        await client.indices.create({
            index: "movies",
            body: {
                mappings: {
                    properties: {
                        id: { type: "keyword" },
                        title: { type: "text" },
                        genres: { type: "keyword" },
                        year: { type: "integer" },
                        plot: { type: "text" },
                        title_vector: { type: "dense_vector", dims: 384 }, // for embeddings
                        plot_vector: { type: "dense_vector", dims: 384 },
                    },
                },
            },
        });
        logger.debug("Movie index was created");
    } else {
        logger.debug("Movie index was already present, nothing to do...");
    }

}
