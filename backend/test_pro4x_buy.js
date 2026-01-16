const axios = require('axios');

async function sendPro4xBuy() {
    try {
        console.log('--- SENDING PRO4X BUY Only ---');
        await axios.post('http://localhost:3000/webhook', {
            ticker: 'NQ',
            strategy: 'pro4x_Buy',
            signal: 'BUY',
            price: 20650,
            message: 'PRO4X BUY DETECTED',
            time: new Date().toISOString()
        });
        console.log('Sent PRO4X BUY');

    } catch (error) {
        console.error('Error sending signals:', error.message);
    }
}

sendPro4xBuy();
