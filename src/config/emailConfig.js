// Email configuration for sending emails using nodemailer

import nodemailer from 'nodemailer';
import { serviceEmail, serviceEmailPass } from './initialConfig.js';

// Create a transporter using SMTP transport
export const transporter = nodemailer.createTransport({
    service: 'gmail',    // Specify the email service provider
    auth: {
        user: serviceEmail,
        pass: serviceEmailPass
    }
});