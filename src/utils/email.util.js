import { transporter } from "../config/email.config.js";



export const sendOTPEmail = async (email, otp) => {

    const mailOptions = {
        to: email,
        subject: 'Reeasy - OTP Verification',
        text: `Your OTP for Reeasy is ${otp}.`
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
};