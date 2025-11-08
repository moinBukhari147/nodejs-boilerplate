import IORedis from "ioredis";
import { redisHost } from "./initial.config.js";


export const redisClient = new IORedis({
    host: redisHost,
    port: 6379,
    maxRetriesPerRequest: null,
    // password: redisPassword,
});