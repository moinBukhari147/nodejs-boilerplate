import { Queue } from "bullmq"
import { redisClient } from "../../config/redis.config.js"
import { MAX_EMAILS, WINDOW_MS } from "../../config/email.config.js";

export const OTP_EMAIL_QUEUE_NAME = "otpEmail";
export const otpEmailQueue = new Queue(OTP_EMAIL_QUEUE_NAME, {
    connection: redisClient,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,    // 1 second
        },
        removeOnComplete: {
            age: 3600,      // complete jobs older than 1 hour is removed to keep redis clean
            count: 1000     // keep only latest 1000 completed jobs
        },
        removeOnFail: { age: 86400, count: 1000 },
    },
    limiter: {
        max: MAX_EMAILS,           // Because Gmail SMTP allows only 500 mails per day
        duration: WINDOW_MS,       // 1 day
    },

});