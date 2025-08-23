import { createMovieIndex } from "@indices/movies"
import { client } from "@config/elastic"

export async function setIndices() {
    client.ping({}, (error: Error) => {
        if (error) {
            console.error('Elasticsearch cluster is down!');
            return;
        } else {
            console.log('Elasticsearch is running.');
        }
    });
    try {
        await createMovieIndex()
    } catch (error) {
        console.log("Error when creating elasticsearch indices:", error)
    }
}
