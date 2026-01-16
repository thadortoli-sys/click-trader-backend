const axios = require('axios');

const WEBHOOK_URL = 'http://localhost:3000/webhook';

const PAYLOAD = {
    ticker: "NQ",
    strategy: "M1 Syncro Bullish",
    price: "20700",
    timeframe: "1m",
    signal: "BUY"
};

console.log("--- SIMULATING M1 SYNCRO SIGNAL ---");
console.log(`Payload:`, PAYLOAD);

(async () => {
    try {
        const response = await axios.post(WEBHOOK_URL, PAYLOAD);
        console.log("Response:", response.data);
        console.log("✅ Sent M1 Syncro!");
    } catch (e) {
        console.error("❌ Error:", e.message);
    }
})();
