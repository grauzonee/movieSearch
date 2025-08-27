import { createMovieIndex } from "@indices/movies"
import { client } from "@config/elastic"
import { logger } from "@helper/logger.js";

export async function setIndices() {
    client.ping({}, (error: Error) => {
        if (error) {
            logger.error('Elasticsearch cluster is down!', error.message);
            return;
        } else {
            logger.debug('Elasticsearch is running.');
        }
    });
    try {
        await createMovieIndex()
    } catch (error) {
        logger.error("Error when creating elasticsearch indices:", error)
    }
}
