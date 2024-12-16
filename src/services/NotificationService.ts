import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export async function sendNotification(email: string, subject: string, message: string, htmlMessage?: string) {
    const OAuth2 = google.auth.OAuth2;

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || 
        !process.env.GOOGLE_REFRESH_TOKEN || !process.env.EMAIL_USER) {
        throw new Error("Missing required environment variables for email service");
    }

    const oauth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    try {
        const { token } = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Explicitly specify the host
            port: 465, // SSL port
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: token, // Use generated access token
            },
        });

        const mailOptions = {
            from: `"Finance Assistant" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            text: message,
            html: htmlMessage || undefined, // Add HTML message if provided
        };

        await transporter.sendMail(mailOptions);
        console.log('Notification sent successfully');
    } catch (error: unknown) {
        // Type assertion to 'Error'
        const err = error as Error;
        console.error('Error sending notification:', err.message || error);

        if (err.message && err.message.includes("Invalid Grant")) {
            // The refresh token might have expired, you might want to re-authenticate
            console.error('Refresh token might be expired. Please authenticate again.');
        }
        
        throw new Error('Failed to send notification');
    }
}
