const axios = require('axios');

const PRODUCTION_URL = 'https://clicktraderappbackend-xjqwf.ondigitalocean.app/webhook';

const testPayload = {
    ticker: "NQ",
    signal: "BUY",
    price: "20550.25",
    timeframe: "M1",
    strategy: "Pro4x Buy",
    videoUrl: ""
};

async function sendTest() {
    console.log('Sending test signal to production...');
    console.log('URL:', PRODUCTION_URL);
    console.log('Payload:', JSON.stringify(testPayload, null, 2));

    try {
        const response = await axios.post(PRODUCTION_URL, testPayload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('\n✅ Success! Server Response:', response.data);
        console.log('\nIf everything is working correctly:');
        console.log('1. The signal should appear in the mobile app history.');
        console.log('2. A push notification should be sent to registered devices.');
    } catch (error) {
        console.error('\n❌ Error sending signal:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Message:', error.message);
        }
    }
}

sendTest();
