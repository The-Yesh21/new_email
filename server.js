const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Email credentials from .env
const EMAIL_ADDRESS = process.env.GMAIL_USER || 'yeshwanth9750@gmail.com';
const APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'fiul nimu bkrm avlf';

// Lazy load nodemailer
let transporter = null;

function getTransporter() {
    if (!transporter) {
        const nodemailer = require('nodemailer');

        // Use SMTP_SSL on port 465 (same as Python script)
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use SSL
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
        res.json({ success: true });
    } catch (error) {
        console.error('❌ Email error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        message: 'Email server is active',
        email: EMAIL_ADDRESS
    });
});

app.listen(PORT, () => {
    console.log(`📧 Email server running on http://localhost:${PORT}`);
    console.log(`Using Gmail: ${EMAIL_ADDRESS}`);
    console.log(`Password configured: ${APP_PASSWORD ? 'Yes ✅' : 'No ❌'}`);
});
