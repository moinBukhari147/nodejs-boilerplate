import { otpEmailQueue } from "../queues/otpEmail.queue.js";
import { redisClient } from "../../config/redis.config.js";
import { REDIS_EMAIL_COUNT_KEY, WINDOW_MS } from "../../config/email.config.js";

export const enqueueOTPEmail = async (email, otp) => {
    try {
        const now = Date.now();
        await redisClient.zremrangebyscore(REDIS_EMAIL_COUNT_KEY, 0, now - WINDOW_MS);
        const emailCount = await redisClient.zcard(REDIS_EMAIL_COUNT_KEY);

        if (emailCount >= MAX_EMAILS) return false; // Rate limit exceeded

        await redisClient.zadd(REDIS_EMAIL_COUNT_KEY, now, now.toString());
        await redisClient.expire(REDIS_EMAIL_COUNT_KEY, 60 * 60 * 25);
        // Add a job to the OTP email queue
        const job = await otpEmailQueue.add("sendOTPEmail", { email, otp });

        console.log(`Enqueued OTP email job with ID: ${job.id} for ${email}`);
        return true;
    } catch (error) {
        throw error;
    }
}