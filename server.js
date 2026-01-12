const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ⭐ CRITICAL: Railway requires this exact setup
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Enable CORS
app.use(cors());
app.use(express.json());

// Email credentials from environment variables
const EMAIL_ADDRESS = process.env.GMAIL_USER;
const APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// Lazy load nodemailer
let transporter = null;

function getTransporter() {
    if (!transporter) {
        const nodemailer = require('nodemailer');
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: EMAIL_ADDRESS,
                pass: APP_PASSWORD
            }
        });
    }
    return transporter;
}

// Email endpoint
app.post('/send-email', async (req, res) => {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const mailer = getTransporter();

        await mailer.sendMail({
            from: `"Alma - AI Learning" <${EMAIL_ADDRESS}>`,
            to: to,
            subject: subject,
            text: message,
            html: `<pre style="font-family: 'Courier New', monospace; white-space: pre-wrap; line-height: 1.6;">${message}</pre>`
        });

        console.log(`✅ Email sent to ${to}`);
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('❌ Email error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Email server is running',
        email: EMAIL_ADDRESS,
        port: PORT
    });
});

// ⭐ CRITICAL: Start server with explicit host binding
const server = app.listen(PORT, HOST, () => {
    console.log(`✅ Server is running on ${HOST}:${PORT}`);
    console.log(`📧 Email: ${EMAIL_ADDRESS}`);
    console.log(`🔑 Password: ${APP_PASSWORD ? 'Configured' : 'Missing'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});