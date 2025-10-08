import 'dotenv/config';
import express from "express";
import { Request, Response } from "express"
import { router as moviesRouter } from "@routes/movies"
import { router as searchRouter } from "@routes/search"
import { setIndices } from "@indices/setIndices";
import { connection } from '@config/redis';
import cors from 'cors'
import { logger } from "@helper/logger";
import { client } from '@config/elastic';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());
app.use('/api', moviesRouter);
app.use('/api', searchRouter);

app.get("/status", (req: Request, res: Response) => {
    res.json({ message: "Semantic Search API is runnning!" });
});
async function startServer() {
    try {
        const required = ["REDIS_HOST", "REDIS_PASS", "ELASTIC_USER", "ELASTIC_PASSWORD"];
        for (const key of required) {
            if (!process.env[key]) {
                throw new Error(`Missing environment variable: ${key}`);
            }
        }
        await connection.ping();
        logger.info("Redis connection successful");
    } catch (err) {
        logger.error("Failed to connect to Redis:", err);
        process.exit(1);
    }

    try {
        const health = await client.cluster.health();
        logger.info("Elasticsearch cluster is reachable:", health.status);
        await setIndices();
    } catch (err) {
        logger.error("Failed to connect to Elasticsearch:", err);
        process.exit(1);
    }

    try {

        app.listen(PORT, () => {
            logger.info(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {

        logger.error("Failed to start server:", err);
        process.exit(1);
    }
}

startServer();

