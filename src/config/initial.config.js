import dotenv from "dotenv";
dotenv.config();
import { getIPAddress } from "../utils/utils.js";
// ==========================================================
//                     Current Enviroment
// ==========================================================


export const nodeEnv = process.env.NODE_ENV || "local";

// ==========================================================
//                    Check Environment Variables
// ==========================================================
if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL in environment env file");
if (!process.env.DATABASE_NAME) throw new Error("Missing DATABASE_NAME in environment env file");
if (!process.env.PORT) throw new Error("Missing PORT in environment env file");
if (!process.env.JWT_SECRET_KEY) throw new Error("Missing JWT_SECRET_KEY in environment env file");
if (!process.env.EMAIL_PASS) throw new Error("Missing EMAIL_PASS in environment env file email will not work properly");
if (nodeEnv === "production" && !process.env.DOMAIN) throw new Error("Missing DOMAIN in environment env file");

// For sending mails
if (!process.env.EMAIL) throw new Error("Missing EMAIL in environment");
if (!process.env.EMAIL_PASS) throw new Error("Missing EMAIL_PASS in environment");

// For oAuth login
// if (!process.env.GOOGLE_CLIENT_ID) throw new Error("Missing GOOGLE_CLIENT_ID in environment");
// if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error("Missing GOOGLE_CLIENT_SECRET in environment env file");
// if (!process.env.FACEBOOK_CLIENT_ID) throw new Error("Missing FACEBOOK_CLIENT_ID in environment");
// if (!process.env.FACEBOOK_CLIENT_SECRET) throw new Error("Missing FACEBOOK_CLIENT_SECRET in environment env file");

// For Redis & Email Jobs
if (!process.env.REDIS_HOST) throw new Error("Missing REDIS_HOST in environment");
if (!process.env.REDIS_PORT) throw new Error("Missing REDIS_PORT in environment");
// if (!process.env.REDIS_PASSWORD) throw new Error("Missing REDIS_PASSWORD in environment");

// ==========================================================
//                     Configuration Variables
// ==========================================================
export const port = process.env.PORT;
export const dbUrl = process.env.DATABASE_URL + process.env.DATABASE_NAME;
export const jwtSecret = process.env.JWT_SECRET_KEY;
export const domain = nodeEnv === "local" ? `http://${getIPAddress()}:${port}` : process.env.DOMAIN;

// For sending mails
export const serviceEmail = process.env.EMAIL;
export const serviceEmailPass = process.env.EMAIL_PASS;

// For oAuth login
// export const googleClientId = process.env.GOOGLE_CLIENT_ID;
// export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
// export const facebookClientId = process.env.FACEBOOK_CLIENT_ID;
// export const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET;

// Redis Configuration
export const redisHost = process.env.REDIS_HOST;
export const redisPort = process.env.REDIS_PORT;
// export const redisPassword = process.env.REDIS_PASSWORD;
