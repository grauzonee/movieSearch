import IORedis from "ioredis"
import { getConfigValue } from "@helper/configHelper"
import { logger } from "@helper/logger";

export const connection = new IORedis({
    host: getConfigValue("REDIS_HOST"),
    password: getConfigValue("REDIS_PASS"),
    maxRetriesPerRequest: null,
    connectTimeout: 5000,
    retryStrategy: null,
})

export async function healthcheckRedis() {
    try {
        const required = ["REDIS_HOST", "REDIS_PASS"];
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

}
