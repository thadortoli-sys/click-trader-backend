const axios = require('axios');

const BACKEND_URL = 'http://localhost:3000/webhook';

const signal = {
    strategy: 'Pro4x Buy',
    ticker: 'MGC',
    price: '2025.50',
    action: 'Buy',
    message: 'Gold Micro Futures - Pro4x Setup found',
    timeframe: '5m'
};

axios.post(BACKEND_URL, signal)
    .then(res => {
        console.log('Status:', res.status);
        console.log('Response:', res.data);
    })
    .catch(err => {
        console.error('Error:', err.message);
    });
