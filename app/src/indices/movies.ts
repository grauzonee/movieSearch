import { client } from "@config/elastic"

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
                        title_vector: { type: "dense_vector", dims: 1536 }, // for embeddings
                        plot_vector: { type: "dense_vector", dims: 1536 },
                    },
                },
            },
        });
        console.log("✅ Movie index created!");
    } else {
        console.log("Index already exists");
    }
}

createMovieIndex().catch(console.error);
