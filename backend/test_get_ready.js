const axios = require('axios');

async function sendGetReadySignals() {
    try {
        console.log('--- SENDING GET READY BUY ---');
        await axios.post('http://localhost:3000/webhook', {
            ticker: 'MNQ',
            strategy: 'GetReady', // Triggers the yellow halo logic
            signal: 'UY',         // Intentional typo or logic to trigger 'Buy' color (Code logic says type==='BUY' or strategy includes 'Buy')
            // Let's use standard format
            action: 'buy',        // Ensure "Buy" is detected
            price: 18500,
            time: new Date().toISOString()
        }, { headers: { 'Content-Type': 'text/plain' } }); // Simulate TradingView format often sent as text
        // Actually the server parser handles text/plain from TV. 
        // Let's send a JSON payload that the server transforms or accepts.
        // Based on previous logs, the server accepts JSON. 

        // Let's rely on the strategy name "GetReady" to trigger the icon, 
        // and "action"/"signal" to trigger the text color.

        await axios.post('http://localhost:3000/webhook', {
            ticker: 'MNQ',
            strategy: 'GetReady',
            signal: 'BUY',
            price: 18550,
            message: 'GET READY BUY DETECTED'
        });
        console.log('Sent GET READY BUY');

        await new Promise(r => setTimeout(r, 5000)); // Wait 5s

        console.log('--- SENDING GET READY SELL ---');
        await axios.post('http://localhost:3000/webhook', {
            ticker: 'MNQ',
            strategy: 'GetReady',
            signal: 'SELL',
            price: 18600,
            message: 'GET READY SELL DETECTED'
        });
        console.log('Sent GET READY SELL');

    } catch (error) {
        console.error('Error sending signals:', error.message);
    }
}

sendGetReadySignals();
