const axios = require('axios');

const BACKEND_URL = 'http://localhost:3000/webhook';

const payload = {
    ticker: "MNQ1!",
    signal: "BUY",
    price: "20550.25",
    strategy: "Pro4x.2 Entry Buy", // This triggers pro4xx_Buy
    timeframe: "1"
};

console.log("🚀 Sending PRO4X.2 Test Signal...");

axios.post(BACKEND_URL, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(response => {
        console.log("✅ Signal Sent!", response.data);
    })
    .catch(error => {
        console.error("❌ Error:", error.message);
    });
