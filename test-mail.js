const nodemailer = require('nodemailer');
console.log('DEBUG: nodemailer type:', typeof nodemailer);
console.log('DEBUG: nodemailer keys:', Object.keys(nodemailer));
console.log('DEBUG: nodemailer:', nodemailer);

require('dotenv').config();

const EMAIL_ADDRESS = process.env.GMAIL_USER;
const APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// Get recipients from command line arguments, default to self if none provided
const args = process.argv.slice(2);
const recipients = args.length > 0 ? args : [EMAIL_ADDRESS];

async function sendTestEmail() {
    if (!EMAIL_ADDRESS || !APP_PASSWORD) {
        console.error('❌ Missing credentials in .env file.');
        return;
    }

    console.log(`📧 Configured Sender: ${EMAIL_ADDRESS}`);
    console.log(`� Target Recipients: ${recipients.join(', ')}`);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: EMAIL_ADDRESS,
            pass: APP_PASSWORD
        }
    });

    for (const recipient of recipients) {
        console.log(`\n🔄 Sending to: ${recipient}...`);
        try {
            const info = await transporter.sendMail({
                from: `"Test Script" <${EMAIL_ADDRESS}>`,
                to: recipient,
                subject: 'Test Email from Nodemailer Script',
                text: 'If you are reading this, the nodemailer configuration is working correctly.',
                html: '<b>Success!</b><p>If you are reading this, the nodemailer configuration is working correctly.</p>'
            });

            console.log(`✅ Email sent to ${recipient}!`);
            console.log(`🆔 Message ID: ${info.messageId}`);
        } catch (error) {
            console.error(`❌ Error sending to ${recipient}:`, error);
        }
    }
}

sendTestEmail();
