import { transporter } from "../config/emailConfig.js";



export const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: 'agoradance.app@gmail.com',
            to: email,
            subject: 'Agora Dance - OTP Verification',
            text: `Your OTP for Agora Dance is ${otp}.`
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent successfully to ${email}`);
        return true; // Return true if email sent successfully
    } catch (error) {
        console.error('Failed to send OTP email:', error);
        return false; // Return false if email sending failed
    }
};