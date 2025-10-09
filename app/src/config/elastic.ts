import { Client } from "@elastic/elasticsearch"
import { getConfigValue } from "@helper/configHelper"
import { logger } from "@helper/logger"

const ELASTIC_BEARER = 'ELASTIC_BEARER'
const ELASTIC_PASSWORD = 'ELASTIC_PASSWORD'
const ELASTIC_USER = 'ELASTIC_USER'

const auth = () => {
    if (process.env[ELASTIC_BEARER]) {
        return {
            apiKey: getConfigValue(ELASTIC_BEARER)
        }
    }
    else if (process.env[ELASTIC_USER] && process.env[ELASTIC_PASSWORD]) {
        return {
            username: getConfigValue(ELASTIC_USER),
            password: getConfigValue(ELASTIC_PASSWORD)
        }
    }
    else {
        throw new Error('Some Elasticsearch auth credentials are not set')
    }
}
export const client = new Client({
    node: getConfigValue("ELASTIC_HOST"),
    auth: auth()
})

export async function healthcheckElastic() {
    try {
        const health = await client.info();
        logger.info("Elasticsearch cluster is reachable:", health.status);
    } catch (err) {
        logger.error("Failed to connect to Elasticsearch:", err);
        process.exit(1);
    }

}
