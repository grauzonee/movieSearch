import 'dotenv/config';
import express from "express";
import { Request, Response } from "express"
import { router as moviesRouter } from "@routes/movies"
import { router as searchRouter } from "@routes/search"
import { setIndices } from "@indices/setIndices";
import { healthcheckRedis } from '@config/redis';
import cors from 'cors'
import { logger } from "@helper/logger";
import { healthcheckElastic } from '@config/elastic';

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
    await healthcheckRedis()
    await healthcheckElastic()

    try {
        await setIndices();
        app.listen(PORT, () => {
            logger.info(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {

        logger.error("Failed to start server:", err);
        process.exit(1);
    }
}

startServer();

