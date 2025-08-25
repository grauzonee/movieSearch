import { Client } from "@elastic/elasticsearch"
import { getConfigValue } from "@helper/configHelper.js"

export const client = new Client({
    node: getConfigValue("ELASTIC_HOST"),
    auth: {
        username: getConfigValue("ELASTIC_USER"),
        password: getConfigValue("ELASTIC_PASSWORD")
    }
})
