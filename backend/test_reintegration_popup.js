const axios = require('axios');

// 1. Define the payload for a Reintegration Bullish (Pump) signal
const payloadPump = {
    ticker: 'TEST',
    strategy: 'TP PUMP', // Original strategy name often used for Reintegration Bullish
    action: 'buy',
    price: 15500,
    message: 'Reintegration Setup Forming - Test'
};

// 2. Define the payload for a Reintegration Bearish (Push) signal
const payloadPush = {
    ticker: 'TEST',
    strategy: 'TP PUSH', // Original strategy name for Bearish
    action: 'sell',
    price: 15600,
    message: 'Reintegration Setup Forming - Test'
};

// 3. Send the request to the local backend
async function sendTestSignal(payload) {
    try {
        console.log(`Sending ${payload.strategy} signal...`);
        const response = await axios.post('http://localhost:3000/webhook', payload);
        console.log(`✅ Response: ${response.status}`, response.data);
    } catch (error) {
        console.error('❌ Error sending signal:', error.message);
        if (error.response) {
            console.error('   Server responded with:', error.response.data);
        }
    }
}

async function runTests() {
    console.log('--- STARTING REINTEGRATION BEARISH TEST ---');
    // await sendTestSignal(payloadPump);
    await sendTestSignal(payloadPush);
    console.log('--- TEST COMPLETE ---');
}

runTests();
