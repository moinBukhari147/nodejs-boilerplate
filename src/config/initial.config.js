import dotenv from "dotenv";
dotenv.config();
import { getIPAddress } from "../utils/utils.js";
// ==========================================================
//                     Current Enviroment
// ==========================================================


const nodeEnv = process.env.NODE_ENV || "local";

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

// ==========================================================
//                     Configuration Variables
// ==========================================================
const port = process.env.PORT;
const dbUrl = process.env.DATABASE_URL + process.env.DATABASE_NAME;
const jwtSecret = process.env.JWT_SECRET_KEY;
const emailPass = process.env.EMAIL_PASS;
const domain = nodeEnv === "local" ? `http://${getIPAddress()}:${port}` : process.env.DOMAIN;

// For sending mails
const serviceEmail = process.env.EMAIL;
const serviceEmailPass = process.env.EMAIL_PASS;

// For oAuth login
// export const googleClientId = process.env.GOOGLE_CLIENT_ID;
// export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
// export const facebookClientId = process.env.FACEBOOK_CLIENT_ID;
// export const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET;




export {
    nodeEnv,
    port,
    jwtSecret,
    dbUrl,
    emailPass,
    domain,
    serviceEmail,
    serviceEmailPass,
};