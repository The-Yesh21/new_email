const fetch = require('node-fetch'); // You might need to install this if not present, or use built-in fetch in Node 18+

// The URL from your .env file
const RAILWAY_URL = 'https://newemail-production-7b9d.up.railway.app';
const ENDPOINT = `${RAILWAY_URL}/send-email`;

const TEST_EMAIL = 'yeshwanth9750@gmail.com'; // Default to your email

async function testDeployment() {
    console.log(`🚀 Testing Deployment at: ${RAILWAY_URL}`);

    // 1. Health Check
    try {
        console.log('💓 Checking Health Endpoint...');
        const healthRes = await fetch(RAILWAY_URL);
        if (healthRes.ok) {
            const healthData = await healthRes.json();
            console.log('✅ Health Check Passed:', healthData);
        } else {
            console.log(`⚠️ Health Check Failed: ${healthRes.status}`);
        }
    } catch (e) {
        console.log(`❌ Connection Failed: ${e.message}`);
    }

    // 2. Send Email
    console.log(`📧 Sending test email to: ${TEST_EMAIL}`);

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: TEST_EMAIL,
                subject: 'Deployment Success! (Railway)',
                message: 'This email confirms that your Railway backend is accessible and working correctly! 🎉',
            }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Server responded with ${response.status}: ${text}`);
        }

        const data = await response.json();
        console.log('✅ Success! Server response:', data);
    } catch (error) {
        console.error('❌ Deployment Test Failed:', error.message);
    }
}

testDeployment();
