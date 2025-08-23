import IORedis from "ioredis"
import { getConfigValue } from "@helper/configHelper"

export const connection = new IORedis({
    host: getConfigValue("REDIS_HOST"),
    password: getConfigValue("REDIS_PASS"),
    maxRetriesPerRequest: null
})
