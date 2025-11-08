// Email configuration for sending emails using nodemailer

import nodemailer from 'nodemailer';
import { serviceEmail, serviceEmailPass } from './initial.config.js';

// Create a transporter using SMTP transport
export const transporter = nodemailer.createTransport({
    service: 'gmail',    // Specify the email service provider
    auth: {
        user: serviceEmail,
        pass: serviceEmailPass
    }
});


export const WINDOW_MS = 24 * 60 * 60 * 1000; // 1 day
export const MAX_EMAILS = 500; // Maximum emails allowed per window
export const REDIS_EMAIL_COUNT_KEY = "email:timestamp"; // Redis key for tracking email timestamps count
