import { Worker } from "bullmq";
import { redisClient } from "../../config/redis.config.js";
import { OTP_EMAIL_QUEUE_NAME } from "../queues/otpEmail.queue.js";
import { sendOTPEmail } from "../../utils/email.util.js";
import { setupGracefulShutdown } from "../../utils/bullmq.util.js";


const otpEmailWorker = new Worker(OTP_EMAIL_QUEUE_NAME, async job => {
    const { email, otp } = job.data;
    await sendOTPEmail(email, otp);
}, {
    connection: redisClient,
    concurrency: 2
});

setupGracefulShutdown(otpEmailWorker, "OTP Email Worker");