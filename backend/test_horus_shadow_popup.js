const axios = require('axios');

// Payload for regular Horus Bearish
const payloadHorusBearish = {
    ticker: 'NQ1!',
    strategy: 'horus_Sell',
    action: 'sell',
    price: 15600,
    message: 'Horus Detection - Bearish Momentum Alignment'
};

// Payload for regular Horus Bullish
const payloadHorusBullish = {
    ticker: 'NQ1!',
    strategy: 'horus_Buy',
    action: 'buy',
    price: 15650,
    message: 'Horus Detection - Bullish Momentum Alignment'
};

// Payload for Setup Forming (GetReady)
const payloadGetReady = {
    ticker: 'NQ1!',
    strategy: 'GetReady',
    action: 'info',
    price: 15700,
    message: 'Institutional Structural Analysis - Setup Forming'
};

// 2. Send the request to the local backend
async function sendTestSignal(payload, name) {
    try {
        console.log(`Sending ${name} signal...`);
        const response = await axios.post('http://localhost:3000/webhook', payload);
        console.log(`✅ ${name} Response: ${response.status}`, response.data);
    } catch (error) {
        console.error(`❌ Error sending ${name} signal:`, error.message);
    }
}

async function runTests() {
    console.log('--- STARTING POPUP TESTS ---');
    await sendTestSignal(payloadHorusBearish, 'Horus Bearish');
    console.log('---');
    await sendTestSignal(payloadHorusBullish, 'Horus Bullish');
    console.log('---');
    await sendTestSignal(payloadGetReady, 'Setup Forming');
    console.log('--- TESTS COMPLETE ---');
}

runTests();
