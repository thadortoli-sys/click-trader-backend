const axios = require('axios');

async function sendBatchSignals() {
    const signals = [
        { type: 'PRO4X BUY', payload: { ticker: 'NQ', strategy: 'pro4x_Buy', signal: 'BUY', price: 20650, message: 'PRO4X BUY SIGNAL' } },
        { type: 'PRO4X SELL', payload: { ticker: 'NQ', strategy: 'pro4x_Sell', signal: 'SELL', price: 20700, message: 'PRO4X SELL SIGNAL' } },
        { type: 'GET READY BUY', payload: { ticker: 'MNQ', strategy: 'GetReady', signal: 'BUY', price: 18500, message: 'GET READY BUY PRE-SIGNAL' } },
        { type: 'GET READY SELL', payload: { ticker: 'MNQ', strategy: 'GetReady', signal: 'SELL', price: 18600, message: 'GET READY SELL PRE-SIGNAL' } }
    ];

    for (const s of signals) {
        try {
            console.log(`Sending ${s.type}...`);
            await axios.post('http://localhost:3000/webhook', {
                ...s.payload,
                time: new Date().toISOString()
            });
            console.log(`✅ ${s.type} Sent`);
            // Wait 2 seconds between signals to avoid cluttering too fast
            await new Promise(r => setTimeout(r, 2000));
        } catch (error) {
            console.error(`❌ Error sending ${s.type}:`, error.message);
        }
    }
}

sendBatchSignals();
